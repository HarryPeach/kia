// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register("spinners", [], function (exports_1, context_1) {
    "use strict";
    var windows;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("windows", windows = {
                interval: 80,
                frames: ["/", "-", "\\", "|"]
            });
        }
    };
});
System.register("util", [], function (exports_2, context_2) {
    "use strict";
    var overwriteLine;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Overwrites text on the current line
             * @param encoder A TextEncoder object
             * @param text The text to be written
             */
            exports_2("overwriteLine", overwriteLine = async (encoder, text) => {
                await Deno.stdout.write(encoder.encode(`\r${text}`));
            });
        }
    };
});
System.register("kia", ["spinners", "util"], function (exports_3, context_3) {
    "use strict";
    var spinners_ts_1, util_ts_1, Kia;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (spinners_ts_1_1) {
                spinners_ts_1 = spinners_ts_1_1;
            },
            function (util_ts_1_1) {
                util_ts_1 = util_ts_1_1;
            }
        ],
        execute: function () {
            Kia = class Kia {
                constructor(options) {
                    this.options = {
                        text: "Sample Loading",
                        color: "red",
                        spinner: spinners_ts_1.windows,
                    };
                    this.currentFrame = 0;
                    this.textEncoder = new TextEncoder();
                    Object.assign(this.options, options);
                }
                async start() {
                    this.timeoutRef = setInterval(async () => {
                        this.currentFrame = (this.currentFrame + 1) % this.options.spinner.frames.length;
                        await this.render();
                    }, this.options.spinner.interval);
                }
                async stop() {
                    clearInterval(this.timeoutRef);
                    console.log();
                }
                async render() {
                    util_ts_1.overwriteLine(this.textEncoder, `${this.options.spinner.frames[this.currentFrame]} ${this.options.text}`);
                }
            };
            exports_3("Kia", Kia);
        }
    };
});

const __exp = __instantiate("kia");
export const Kia = __exp["Kia"];

