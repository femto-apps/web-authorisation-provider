class Utils {
  constructor() {}

  static matches(pattern, string) {
    // takes in two strings, e.g. 'a:b:c:*' and 'a:b:*:d' would match.
    pattern = pattern.split(':')
    string = string.split(':')

    for (let position in pattern) {
      const section = pattern[position]

      if (position > string.length) return true
      if (section === '*') return true
      if (section === '+') continue

      if (section !== string[position]) return false
    }

    return true
  }
}



module.exports = Utils