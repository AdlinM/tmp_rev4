export default {
  constuctor () {
    this.interceptor = null
  },
  setInterceptor (interceptor) {
    this.interceptor = interceptor
  },
  getInterceptor () {
    return this.interceptor
  }
}
