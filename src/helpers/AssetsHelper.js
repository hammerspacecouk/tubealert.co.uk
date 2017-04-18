class AssetsHelper {
  constructor(assetManifest, staticHost) {
    this.assetManifest = assetManifest;
    this.staticHost = staticHost;
  }

  get(asset) {
    const path = this.assetManifest[asset] || asset;
    return this.staticHost + path;
  }
}

module.exports = AssetsHelper;
