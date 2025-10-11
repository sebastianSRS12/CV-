class NextRequest {
  constructor(url) {
    this.url = url;
    this.headers = new Map();
  }
}
module.exports = { NextRequest };