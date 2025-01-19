const router = require('express').Router();

const BcryptJs = require('bcryptjs');
const Passport = require('../modules/passport');
const UserModel = require('../models/user');
const UserRole = require('../constants/user-role');

router.get('/dang-nhap.html', (req, res) => {
  const model = {
    callbackUrl: '/dang-nhap.html'
  };

  if (req.query.returnUrl && req.query.returnUrl.length > 0) {
    model.callbackUrl = `${model.callbackUrl}?returnUrl=${req.query.returnUrl}`;
  }

  res.render('site/login', model);
});

router.post('/dang-nhap.html', Passport.auth(), (req, res) => {
  let sReturnUrl = undefined;

  if (req.query.returnUrl && req.query.returnUrl.length > 0) {
    sReturnUrl = decodeURI(req.query.returnUrl);
  }
  
  if (!sReturnUrl) {
    return res.redirect('/');
  }
  else {
    return res.redirect(sReturnUrl);
  }
});

router.get('/dang-xuat.html', (req, res) => {
  req.logout();
  res.redirect('/dang-nhap.html');
});

router.get('/dang-ky.html', (req, res) => {
  res.render('site/register', {
    isAuthenticated: req.isAuthenticated(),
    errors: null
  });
});


router.post('/dang-ky.html', async (req, res) => {
  const respData = {
    isSucceed: false,
    errors: null,
    message: 'Thất bại'
  };

  if (req.isAuthenticated() === false) {
    req.checkBody('fullname', 'Họ tên không được rỗng. ').notEmpty();

    req.checkBody('fullname', 'Họ tên từ 6 đến 30 ký tự. ').isLength({
      min:6,
      max:30
    });

    req.checkBody('email', 'Email không được rỗng. ').notEmpty();

    req.checkBody('email', 'Định dạng Email không hợp lệ. ').isEmail();

    req.checkBody('password', 'Mật khẩu không được rỗng.').notEmpty();
    req.checkBody('password', 'Mật khẩu phải lớn hơn 6 kí tự. ').isLength({
      min:6,
      
    });

    req.checkBody('repassword', 'Mật khẩu nhập lại không được rỗng. ').notEmpty();

    respData.errors = req.validationErrors();
  
    if (respData.errors) {
      // return res.render('site/register', {
      //   errors
      // });
      return res.json(respData);
    }
    else if (req.body.password !== req.body.repassword) {
      // return res.render('site/register', {
      //   errors: [
      //     {
      //       msg: 'Mật khẩu không hợp lệ'
      //     }
      //   ]
      // });
      respData.errors = [
        {
          msg: 'Mật khẩu không hợp lệ.'
        }
      ];

      return res.json(respData);
    }

    const sEmail = req.body.email.trim().toLowerCase();
    
    const lst = await UserModel.find(
      {
        email: sEmail
      }
    ).lean();

    if (lst && lst.length > 0) {
      // return res.render('site/register', {
      //   errors: [
      //     {
      //       msg: 'Email đã tồn tại'
      //     }
      //   ]
      // });
      respData.errors = [
        {
          msg: 'Email đã tồn tại. '
        }
      ];
      
      return res.json(respData);
    }
    
    const sHashSalt = BcryptJs.genSaltSync(16);

    const sPassword = BcryptJs.hashSync(req.body.password, sHashSalt);
    
    await UserModel.create(
      {
        fullname: req.body.fullname,
        email: sEmail,
        password: sPassword,
        roles: [
          UserRole.customer
        ]
      }
    );

    req.flash('response_message', 'Đã Đăng Ký Thành Công.');
    respData.isSucceed = true;
    respData.message = 'Thành công';
    return res.json(respData);
    
  }
  
  // return res.redirect('/');
  return res.render('site/register', {
    isAuthenticated: req.isAuthenticated(),
    errors: [
      {
        msg: '11111111111111'
      }
    ]
  });
  
});

module.exports = router;
