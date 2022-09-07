
const BasicValueSource = () => ({
    get() { return this }
})

export default {
    Interval: {
        id: "Interval",
        name: "Timer",
        description: "Generates a signal once every specified time period.",
        categories: ["Timing"],
        targets: {
            values: {
                period: {}
            }
        },
        sources: {
            signals: {
                " ": {}
            }
        },
        setup(valueTargets, signalSources) {
            valueTargets.period[0] > 10 && setInterval(() => {
                signalSources[" "]?.()
            }, valueTargets.period[0])
        }
    },
    Delay: {
        id: "Delay",
        name: "Delay",
        description: "",
        categories: ["Timing"],
        targets: {
            values: {
                time: {}
            },
            signals: {
                start: {
                    action: (valueTargets, signalSources) =>
                        x => setTimeout(() => signalSources[" "]?.(x), valueTargets.time[0])
                }
            }
        },
        sources: {
            signals: {
                " ": {}
            }
        }
    },
    Variable: {
        id: "Variable",
        name: "Variable",
        description: "Basic variable.",
        categories: [],
        targets: {
            values: {
                initial: {}
            },
            signals: {
                set: {
                    action() {
                        return function (newValue) {
                            return this.value = newValue
                        }
                    }
                }
            }
        },
        sources: {
            values: {
                current: BasicValueSource()
            }
        },
        setup(valueTargets, signalSources) {
            this.current = valueTargets.initial
        },
    },
    Number: {
        id: "Number",
        name: "Number",
        description: "Beep boop. Just a number.",
        categories: ["Primitive"],
        sources: {
            values: {
                " ": BasicValueSource()
            }
        }
    },
    Text: {
        id: "Text",
        name: "Text",
        description: "Just good ol' fashioned text.",
        categories: ["Primitive"],
        sources: {
            values: {
                " ": BasicValueSource()
            }
        }
    },
    RandomNumber: {
        id: "RandomNumber",
        name: "Random Number",
        description: "Generates a random number.",
        categories: ["Math"],
        sources: {
            values: {
                " ": {
                    get: () => Math.random()
                }
            }
        }
    },
    Sum: {
        id: "Sum",
        name: "Sum",
        description: "Sums inputs together.",
        categories: ["Math"],
        targets: {
            values: {
                in: {}
            }
        },
        sources: {
            values: {
                sum: {
                    get(valueTargets) {
                        return valueTargets.in.reduce((accum, cur) => accum + cur, 0)
                    }
                }
            }
        },
    },
    Bind: {
        id: "Bind",
        name: "Bind",
        description: "Binds a value to a signal.",
        categories: ["Utility"],
        targets: {
            values: {
                value: {}
            },
            signals: {
                signal: {
                    action(valueTargets, signalSources) {
                        return () => signalSources.out?.(valueTargets.value)
                    }
                }
            }
        },
        sources: {
            signals: {
                out: {}
            }
        },
    },
    Unbind: {
        id: "Unbind",
        name: "Unbind",
        description: "Separates a signal and the values it contains.",
        categories: ["Utility"],
        targets: {
            values: {
                value: {}
            },
            signals: {
                signal: {
                    action(valueTargets, signalSources) {
                        return () => signalSources.out?.(valueTargets.value)
                    }
                }
            }
        },
        sources: {
            signals: {
                out: {}
            }
        },
    },
    Log: {
        id: "Log",
        name: "Log",
        description: "Prints to console.",
        categories: ["Debug"],
        targets: {
            signals: {
                " ": {
                    action: () => x => x?.length == 1 ? console.log(x[0]) : console.log(x)
                }
            }
        }
    }
}