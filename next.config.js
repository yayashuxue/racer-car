const nextConfig = {
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
