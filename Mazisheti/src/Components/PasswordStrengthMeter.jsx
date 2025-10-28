import React, { useState } from 'react';

const PasswordStrengthMeter = ({ onPasswordChange }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    if (score <= 2) return 'Weak';
    if (score === 3 || score === 4) return 'Medium';
    return 'Strong';
  };

  const handlePasswordChange = (e) => {
    const newPwd = e.target.value;
    setPassword(newPwd);
    const strengthValue = calculateStrength(newPwd);
    setStrength(strengthValue);
    if (onPasswordChange) {
      onPasswordChange(newPwd);
    }
  };

  const getBarColor = () => {
    switch (strength) {
      case 'Weak':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3 w-full max-w-md">
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
        className="p-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {password && (
        <>
          <div className={`h-2 rounded-md transition-all duration-300 ${getBarColor()}`} />
          <p className="text-sm font-medium text-gray-700">{strength} Password</p>
        </>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
