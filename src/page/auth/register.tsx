import React, { useState, FormEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../component/navbar';
import Footer from '../../component/footer';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const navigate = useNavigate();

  const validatePassword = (value: string) => {
    const validationRules = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };

    setValidations(validationRules);

    // Calculate password strength
    const strength = Object.values(validationRules).filter(v => v).length;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (passwordStrength < 4) {
      alert("Password is too weak. Please strengthen your password.");
      return;
    }

    // Add registration logic here
    console.log('Registration attempted with:', { 
      username, 
      email, 
      password 
    });

    // Navigate to login or dashboard
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen flex flex-col">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-20"
      >
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-green-100">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center"
            >
              <UserPlus className="text-green-800 w-10 h-10" />
            </motion.div>
            <h2 className="text-4xl font-extrabold text-green-900">
              Create Account
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Join our herbal health revolution
            </p>
          </div>
          
          <form 
            onSubmit={handleSubmit} 
            className="mt-8 space-y-6"
          >
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Username"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Email address"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="w-full h-1 flex">
                {[1, 2, 3, 4].map((segment) => (
                  <div 
                    key={segment} 
                    className={`h-full flex-1 mx-1 rounded-full transition-all duration-300 
                      ${passwordStrength >= segment ? getPasswordStrengthColor() : 'bg-gray-300'}`}
                  />
                ))}
              </div>

              {/* Password Validation Rules */}
              <div className="text-sm space-y-1">
                {Object.entries(validations).map(([key, isValid]) => (
                  <div key={key} className="flex items-center">
                    {isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={isValid ? 'text-gray-600' : 'text-red-500'}>
                      {key === 'length' && 'At least 8 characters'}
                      {key === 'uppercase' && 'One uppercase letter'}
                      {key === 'lowercase' && 'One lowercase letter'}
                      {key === 'number' && 'One number'}
                      {key === 'specialChar' && 'One special character'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </motion.div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-green-600 hover:text-green-500">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Account
              </button>
            </motion.div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;