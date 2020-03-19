exports.connect = async connection => {
  const { res } = connection
  res.setHeader('Set-Cookie', `session=''; max-age='0'; expires='0';`)
  return { text: { error: 0 } }
}