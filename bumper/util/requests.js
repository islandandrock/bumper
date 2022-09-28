import file from './server.json'
let server = file.ip
if (server == "REPLACEME") {
  console.log("Change the IP in server.json!!!")
}

export function getFromWeb() {
  let x = fetch(server)
}