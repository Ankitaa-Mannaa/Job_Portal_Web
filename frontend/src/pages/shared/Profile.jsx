// src/pages/shared/Profile.jsx
import { useAuth } from "../../context/AuthContext";
import { LogOut, Mail, User, Shield, Copy, Check } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [tokenCopied, setTokenCopied] = useState(false);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(user.token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy token:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 p-8 rounded-3xl shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">No user data found</p>
          <p className="text-gray-500 text-sm mt-2">Please log in to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Main Profile Card */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Header with 3-color gradient */}
          <div className="bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 px-8 py-10 text-center relative text-white">
            <div className="absolute top-6 right-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Avatar */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white/40">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            {/* Name and Email */}
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-white/90 font-medium">{user.email}</p>
          </div>

          {/* Details Section */}
          <div className="px-8 py-8 space-y-6">
            {/* User ID */}
            <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">User ID</p>
                <p className="text-xl font-semibold text-gray-800">{user.id}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Role</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "MANAGER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Token */}
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Access Token</p>
                </div>
                <button
                  onClick={copyToken}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {tokenCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 max-h-32 overflow-y-auto">
                <code className="text-xs text-gray-600 break-all leading-relaxed font-mono">
                  {user.token}
                </code>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Active Session</span>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
            <span className="text-purple-600">Secure Connection</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-blue-600">JWT Authentication</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-orange-600">Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
