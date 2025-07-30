import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="shadow-elegant backdrop-blur-sm bg-card/95 rounded-lg border-2 p-6 border-blue-500">
          <div className="text-center space-y-4 mb-6">
            <div className="mx-auto w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center ">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-12 w-full rounded-lg border-2 border-blue-500 bg-input px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none  transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-12 w-full rounded-lg border-2 border-blue-500 bg-input px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none  transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-12 w-full rounded-lg border-2 border-blue-500 bg-input px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none  transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 text-base inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all duration-300 border-blue-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white text-primary-foreground shadow-elegant hover:shadow-glow hover:scale-[1.02] font-semibold"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?
              <a
                href="/login"
                className="text-primary text-blue-500 hover:text-primary-glow transition-colors font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
