import app from "./app"
import config from "./config"


const main = () => {
  app.listen(config.port, () => {
    console.log(`DevPulse server is runnig on port ${config.port}`)
  })
}
main()