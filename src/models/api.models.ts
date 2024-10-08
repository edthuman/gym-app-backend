import fs from "fs"

export const selectEndpoints = () => {
    try {
        const endpointsJSON = fs.readFileSync(`${__dirname}/../../endpoints.json`, {encoding: "utf-8"})
        const endpoints = JSON.parse(endpointsJSON)
        return endpoints
    }
    catch {
        return ""
    }
}