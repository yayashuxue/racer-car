const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Set to false to disable linting during builds
  },
  webpack: (config, { isServer }) => {
    // Add .wasm file support
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Fix for Next.js issue with WebAssembly, preventing server-side bundling
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false };
    }

    return config;
  },
};

export default nextConfig;
