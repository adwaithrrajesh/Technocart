const express = require("express");
const session = require("express-session");
const router = express.Router();
const otp = require("../helpers/otp");
const sellerHelper = require("../helpers/seller_helper");
const { Sms, verify } = require("../helpers/otp");
const seller_model = require('../model/seller_model')
const expressFlash = require('express-flash');
const { response } = require("express");

module.exports = {
  Login: (req, res) => {
    res.render("Seller/login",{ expressFlash: req.flash("Success") });
  },
  Register: async (req, res) => {
    req.session.seller = req.body;
    let seller = req.session.seller;
    let SellerEmail = seller.Email;
    req.session.sellernumber = req.body.PhoneNumber;
    let phone = req.session.sellernumber;
    // Checking Email
    let EmailCheck = await seller_model.findOne({ Email: SellerEmail });
    if (!EmailCheck) {
    res.render("Seller/otp");
    } else {
      req.flash("Success", "Seller Already Exists");
      res.redirect('/seller/login')
    }
  },
  DoLogin:(req,res)=>{
    let seller = req.body
    sellerHelper.DoLogin(seller).then((response)=>{
      if(response){
        req.session.SellerLogin = true
        res.redirect('/seller')
      }else{
        req.flash("Success","Invalid Email or Password")
        res.redirect('/seller/login')
      }
    })
  },
  Logout:(req,res)=>{
    req.session.destroy();
    res.redirect("/seller");
  },
  Otp: (req, res) => {
    let seller = req.session.seller
    sellerHelper.InsertData(seller).then(()=>{
    res.redirect("/seller/login");
    })
  },
  Home:(req,res)=>{
    res.render('Seller/home/home')
  },
  AddProduct:(req,res)=>{
    res.render('Seller/home/AddProduct')
  }
};
