class Page {
  start() {}
  render() {}
  end(modal) {
    return true;
  }
  data() {
    // don't collect data from page by default
    return false;
  }
  review(dom) {}
  close() {}
}
