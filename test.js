let allNames = [
  { "name": "Rainer Zufall", "email": "d-test@mail.com" },
  { "name": "Andy Arbeit", "email": "e-test@mail.com" },
  { "name": "Bernhard Diener", "email": "b-test@mail.com" },
  { "name": "Ernst Haft", "email": "a-test@mail.com" }

]

console.log(allNames.sort());

let sortedList = allNames.sort((a, b) => a.name.localeCompare(b.name));
console.log(sortedList);