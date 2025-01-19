import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../component/navbar';
import Footer from '../../component/footer';
import { authService, RegisterData } from '../../services/auth/auth';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      setPasswordStrength(Object.values(validationRules).filter(v => v).length);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
      }

      if (passwordStrength < 4) {
          setError("Password is too weak. Please strengthen your password.");
          return;
      }

      setLoading(true);

      try {
          const registrationData: RegisterData = {
              username,
              email,
              password
          };

          await authService.register(registrationData);

          navigate('/login', {
              state: {
                  message: 'Registration successful! Please log in.'
              }
          });
      } catch (error: any) {
          const errorMessage = error.message || 'Registration failed. Please try again.';
          setError(errorMessage);
          console.error('Registration error:', error);
      } finally {
          setLoading(false);
      }
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
                  <div>
                      <div className="flex justify-center">
                          <UserPlus className="h-12 w-12 text-green-500" />
                      </div>
                      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                          Create your account
                      </h2>
                  </div>

                  {error && (
                      <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                          {error}
                      </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                                  type="text"
                                  required
                                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="Username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                              />
                          </div>

                          {/* Email Input */}
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-green-500" />
                              </div>
                              <input
                                  type="email"
                                  required
                                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="Email address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                              />
                          </div>

                          {/* Password Input */}
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-green-500" />
                              </div>
                              <input
                                  type={showPassword ? "text" : "password"}
                                  required
                                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="Password"
                                  value={password}
                                  onChange={handlePasswordChange}
                              />
                              <div 
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                  onClick={() => setShowPassword(!showPassword)}
                              >
                                  {showPassword ? (
                                      <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                      <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                              </div>
                          </div>

                          {/* Password Strength Indicator */}
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                  className={`h-2.5 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                          </div>

                          {/* Password Validation Rules */}
                          <div className="text-sm text-gray-600 space-y-1">
                              {Object.entries(validations).map(([key, isValid]) => (
                                  <div key={key} className="flex items-center space-x-2">
                                      {isValid ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : (
                                          <AlertCircle className="h-4 w-4 text-red-500" />
                                      )}
                                      <span>{
                                          {
                                              length: "At least 8 characters",
                                              uppercase: "Contains an uppercase letter",
                                              lowercase: "Contains a lowercase letter",
                                              number: "Contains a number",
                                              specialChar: "Contains a special character"
                                          }[key]
                                      }</span>
                                  </div>
                              ))}
                          </div>

                          {/* Confirm Password Input */}
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-green-500" />
                              </div>
                              <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  required
                                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="Confirm Password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              <div 
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                  {showConfirmPassword ? (
                                      <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                      <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                              </div>
                          </div>

                          {/* Submit Button */}
                          <div>
                              <button
                                  type="submit"
                                  disabled={loading}
                                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  {loading ? (
                                      <div className="flex items-center">
                                          <svg 
                                              className="animate-spin h-5 w-5 mr-3" 
                                              xmlns="http://www.w3.org/2000/svg" 
                                              fill="none" 
                                              viewBox="0 0 24 24"
                                          >
                                              <circle 
                                                  className="opacity-25" 
                                                  cx="12" 
                                                  cy="12" 
                                                  r="10" 
                                                  stroke="currentColor" 
                                                  strokeWidth="4"
                                              ></circle>
                                              <path 
                                                  className="opacity-75" 
                                                  fill="currentColor" 
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                              ></path>
                                          </svg>
                                          Registering...
                                      </div>
                                  ) : (
                                      "Create Account"
                                  )}
                              </button>
                          </div>
                      </motion.div>
                  </form>

                  {/* Login Link */}
                  <div className="text-center mt-6">
                      <p className="text-sm text-gray-600">
                          Already have an account?{' '}
                          <Link 
                              to="/login" 
                              className="font-medium text-green-600 hover:text-green-500 transition-colors"
                          >
                              Log in
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