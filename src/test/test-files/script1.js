
var x = "Hello from Yaitde Script Runner";
pm.log("script run: " + x);

console.log(ya.expect);
ya.expect(5).to.be(5);

return { result: x };