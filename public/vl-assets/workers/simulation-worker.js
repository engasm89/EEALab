// Simulation Worker - Runs simulations in a sandboxed environment
class SimulationEngine {
  constructor() {
    this.isRunning = false
    this.manifest = null
    this.boardState = {}
    this.intervalId = null
    this.resourceUsage = { cpu: 0, memory: 0, fastBuildSeconds: 0 }
  }

  init(manifest, labId) {
    this.manifest = manifest
    this.labId = labId
    this.boardState = {}

    // Initialize board-specific state
    if (manifest.board === "arduino-uno") {
      this.boardState = {
        led13: false,
        pins: Array(14).fill(false),
        analogPins: Array(6).fill(0),
      }
    } else if (manifest.board === "esp32") {
      this.boardState = {
        wifi: false,
        sensorValue: 0,
        gpio: {},
      }
    }

    this.postMessage({ type: "console", data: { message: "Simulation engine initialized" } })
  }

  run(code, language) {
    if (this.isRunning) return

    this.isRunning = true
    this.postMessage({ type: "console", data: { message: `Compiling ${language} code...` } })

    try {
      if (language === "cpp" && this.manifest.board === "arduino-uno") {
        this.runArduinoSimulation(code)
      } else if (language === "micropython" && this.manifest.board === "esp32") {
        this.runESP32Simulation(code)
      } else {
        throw new Error(`Unsupported combination: ${language} on ${this.manifest.board}`)
      }
    } catch (error) {
      this.postMessage({ type: "error", data: { message: error.message } })
      this.isRunning = false
    }
  }

  runArduinoSimulation(code) {
    this.postMessage({ type: "console", data: { message: "Starting Arduino simulation..." } })

    // Simple Arduino blink simulation
    let ledState = false
    let loopCount = 0

    // Check if code contains digitalWrite and LED pin 13
    const hasLED13 = code.includes("digitalWrite(13") || code.includes("digitalWrite(LED_BUILTIN")
    const hasDelay = code.includes("delay(")

    if (hasLED13) {
      this.intervalId = setInterval(
        () => {
          if (!this.isRunning) return

          ledState = !ledState
          this.boardState.led13 = ledState
          loopCount++

          this.postMessage({
            type: "board-state",
            data: { state: { ...this.boardState } },
          })

          this.postMessage({
            type: "console",
            data: { message: `LED ${ledState ? "ON" : "OFF"} (loop ${loopCount})` },
          })

          // Update resource usage
          this.resourceUsage.cpu = Math.min(100, 20 + Math.random() * 30)
          this.resourceUsage.memory = Math.min(100, 15 + Math.random() * 20)
          this.resourceUsage.fastBuildSeconds += 1

          this.postMessage({
            type: "resource-usage",
            data: { usage: { ...this.resourceUsage } },
          })
        },
        hasDelay ? 1000 : 500,
      ) // Simulate delay timing
    } else {
      this.postMessage({ type: "console", data: { message: "No LED control detected in code" } })
    }
  }

  runESP32Simulation(code) {
    this.postMessage({ type: "console", data: { message: "Starting ESP32 simulation..." } })

    // Simulate WiFi connection
    setTimeout(() => {
      this.boardState.wifi = true
      this.postMessage({
        type: "board-state",
        data: { state: { ...this.boardState } },
      })
      this.postMessage({ type: "console", data: { message: "WiFi connected" } })
    }, 2000)

    // Simulate sensor readings
    this.intervalId = setInterval(() => {
      if (!this.isRunning) return

      // Generate random sensor data
      this.boardState.sensorValue = Math.floor(Math.random() * 1024)

      this.postMessage({
        type: "board-state",
        data: { state: { ...this.boardState } },
      })

      this.postMessage({
        type: "console",
        data: { message: `Sensor reading: ${this.boardState.sensorValue}` },
      })

      // Update resource usage
      this.resourceUsage.cpu = Math.min(100, 25 + Math.random() * 40)
      this.resourceUsage.memory = Math.min(100, 20 + Math.random() * 30)
      this.resourceUsage.fastBuildSeconds += 1

      this.postMessage({
        type: "resource-usage",
        data: { usage: { ...this.resourceUsage } },
      })
    }, 2000)
  }

  stop() {
    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.postMessage({ type: "stopped" })
    this.postMessage({ type: "console", data: { message: "Simulation stopped" } })
  }

  reset() {
    this.stop()
    this.boardState = {}
    this.resourceUsage = { cpu: 0, memory: 0, fastBuildSeconds: 0 }
    this.init(this.manifest, this.labId)
  }

  handlePinChange(pin, value) {
    if (this.boardState[pin] !== undefined) {
      this.boardState[pin] = value
      this.postMessage({
        type: "board-state",
        data: { state: { ...this.boardState } },
      })
      this.postMessage({
        type: "console",
        data: { message: `Pin ${pin} set to ${value}` },
      })
    }
  }

  postMessage(message) {
    self.postMessage(message)
  }
}

// Worker message handler
const engine = new SimulationEngine()

self.onmessage = (event) => {
  const { type, data } = event.data

  switch (type) {
    case "init":
      engine.init(data.manifest, data.labId)
      break
    case "run":
      engine.run(data.code, data.language)
      break
    case "stop":
      engine.stop()
      break
    case "reset":
      engine.reset()
      break
    case "pin-change":
      engine.handlePinChange(data.pin, data.value)
      break
  }
}
