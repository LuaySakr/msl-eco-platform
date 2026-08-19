const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ethUtil = require('ethereumjs-util');
const config = require('../config');
const UserModel = require('../models/user.model');
const mockData = require('../services/mockData.service');
const { successResponse, errorResponse, validationErrorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const LOGIN_MESSAGE = 'Login Quant Fund';

const verifyWalletAddress = async (publicAddress, signature, message = LOGIN_MESSAGE) => {
  try {
    const msgBuffer = Buffer.from(message, 'utf8');
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);
    return address.toLowerCase() === publicAddress.toLowerCase();
  } catch (error) {
    logger.error('Wallet verification error:', error);
    return false;
  }
};

exports.loginWithSignature = async (req, res, next) => {
  try {
    const { address, signature, referral_address } = req.body;
    
    if (!address || !signature) {
      const { response, statusCode } = validationErrorResponse('Address and signature are required');
      return res.status(statusCode).json(response);
    }

    // Check if address is blocked
    if (config.blockedAddresses.includes(address.toLowerCase())) {
      const { response, statusCode } = errorResponse('This address is blocked', 403);
      return res.status(statusCode).json(response);
    }

    const isValid = await verifyWalletAddress(address, signature);
    if (!isValid) {
      const { response, statusCode } = errorResponse('Wallet signature verification failed', 401);
      return res.status(statusCode).json(response);
    }

    let users = await UserModel.getUsersDetailsAddress({ address });
    
    if (users.length === 0) {
      let referralId = null;
      if (referral_address) {
        const refUsers = await UserModel.getUserDetailsByAddress(referral_address);
        if (refUsers.length === 0) {
          const { response, statusCode } = validationErrorResponse('Invalid referral code');
          return res.status(statusCode).json(response);
        }
        referralId = refUsers[0].id;
      }
      
      const referralCode = 'REF' + Math.random().toString(36).substr(2, 5).toUpperCase();
      const saved = await UserModel.saveUserAddressDetails({ 
        address, 
        referral_id: referralId, 
        referral_code: referralCode 
      });
      users = [{ id: saved.insertId, address, referral_code: referralCode, is_admin: 0 }];
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, address: user.address },
      config.JWT_SECRET_KEY,
      { expiresIn: config.SESSION_EXPIRES_IN }
    );

    const { response, statusCode } = successResponse({
      id: user.id,
      address: user.address,
      referral_code: user.referral_code,
      authToken: token,
      is_admin: user.is_admin,
    }, 'Login successful');

    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { response, statusCode } = successResponse({
      id: req.user_id,
      address: req.address,
    });
    return res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      const { response, statusCode } = validationErrorResponse('firstName, lastName, email and password are required');
      return res.status(statusCode).json(response);
    }

    const existing = mockData.getUserByEmail(email);
    if (existing.length > 0) {
      const { response, statusCode } = errorResponse('An account with this email already exists', 409);
      return res.status(statusCode).json(response);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const saved = mockData.createEmailUser({ first_name: firstName, last_name: lastName, email, password_hash });

    const token = jwt.sign(
      { id: saved.id, email: saved.email },
      config.JWT_SECRET_KEY,
      { expiresIn: config.SESSION_EXPIRES_IN }
    );

    const { response, statusCode } = successResponse({
      id: saved.id,
      email: saved.email,
      firstName: saved.first_name,
      lastName: saved.last_name,
      access_token: token,
    }, 'Registration successful');

    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Register error:', error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const { response, statusCode } = validationErrorResponse('Email and password are required');
      return res.status(statusCode).json(response);
    }

    const users = mockData.getUserByEmail(email);
    if (users.length === 0) {
      const { response, statusCode } = errorResponse('Invalid credentials', 401);
      return res.status(statusCode).json(response);
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      const { response, statusCode } = errorResponse('Invalid credentials', 401);
      return res.status(statusCode).json(response);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET_KEY,
      { expiresIn: config.SESSION_EXPIRES_IN }
    );

    const { response, statusCode } = successResponse({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      access_token: token,
    }, 'Login successful');

    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

exports.refresh = async (_req, res) => {
  const { response, statusCode } = errorResponse('Not implemented', 501);
  return res.status(statusCode).json(response);
};

exports.logout = async (_req, res) => {
  const { response, statusCode } = successResponse(null, 'Logout successful');
  return res.status(statusCode).json(response);
};
