import User from '../models/user.mjs';

class HomeController {
  static index(req, res) {
    const messages = req.flash('info');
    res.render('index', { title: 'Home Page', user: req.session.user, messages });
  }

  static login(req, res) {
    const error = req.flash('error');
    res.render('login', { title: 'Login', error });
  }

  static signup(req, res) {
    const error = req.flash('error');
    res.render('signup', { title: 'Signup', error });
  }

  static async createSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;

      if (!name || !email || !password || !confirmpasword) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/signup');
      }

      if (password !== confirmpasword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/signup');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash('error', 'Email already in use.');
        return res.redirect('/signup');
      }

      const newUser = new User({
        name,
        email,
        password,
        age: age || undefined,
      });

      await newUser.save();
      req.flash('info', 'User registered successfully.');
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Server error. Please try again.');
      res.redirect('/signup');
    }
  }

  static async createLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        req.flash('error', 'Email and password are required.');
        return res.redirect('/login');
      }

      const user = await User.findOne({ email });
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      const isMatch = user.password === password;
      if (isMatch) {
        req.session.user = user;
        req.flash('info', 'Login successful.');
        res.redirect('/');
      } else {
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
      req.flash('error', 'Server error. Please try again.');
      res.redirect('/login');
    }
  }

  // API cho đăng ký (Flutter)
  static async apiCreateSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;

      if (!name || !email || !password || !confirmpasword) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      if (password !== confirmpasword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      const newUser = new User({
        name,
        email,
        password,
        age: age || undefined,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.', user: { name, email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API cho đăng nhập (Flutter)
  static async apiCreateLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = user.password === password;
      if (isMatch) {
        req.session.user = user;
        res.status(200).json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
      } else {
        res.status(401).json({ message: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
}

export default HomeController;
