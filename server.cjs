"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../opt/npm-tools/node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/constants.js"(exports2, module2) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module2.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/limiter.js"(exports2, module2) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/validation.js"(exports2, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module2.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module2.exports = Receiver2;
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/sender.js"(exports2, module2) {
    "use strict";
    var { Duplex } = require("stream");
    var { randomFillSync } = require("crypto");
    var {
      types: { isUint8Array }
    } = require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/event-target.js"(exports2, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/extension.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name2, elem) {
      if (dest[name2] === void 0) dest[name2] = [elem];
      else dest[name2].push(elem);
    }
    function parse2(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name2 = header.slice(start, end);
            if (code === 44) {
              push(offers, name2, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name2;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse: parse2 };
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https = require("https");
    var http = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Duplex, Readable } = require("stream");
    var { URL: URL2 } = require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse: parse2 } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse2(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/stream.js"(exports2, module2) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream2;
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/subprotocol.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse2(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse: parse2 };
  }
});

// ../../../opt/npm-tools/node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../../opt/npm-tools/node_modules/ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http = require("http");
    var { Duplex } = require("stream");
    var { createHash } = require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// public/index.html
var public_default = '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font-size:14px}</style><title>\uBC45! \uC628\uB77C\uC778</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@400;500;700&display=swap">\n<style>\n/* \uB808\uC774\uC544\uC6C3: \uC138\uB85C \uC804\uC6A9. \uC704 = \uC0C1\uB300 \uD310 2\uC5F4, \uAC00\uC6B4\uB370 = \uC548\uB0B4\xB7\uAE30\uB85D(\uC791\uAC8C), \uC544\uB798 = \uB0B4 \uD310\xB7\uBC84\uD2BC\xB7\uC190\uD328 */\n:root {\n  --bg: #ece0c6; --surface: #f6eed9; --felt: #e3d5b4; --ink: #2a1c12; --muted: #6b5a47; --line: #b9a888;\n  --brass: #9a6a1c; --blood: #a3281c; --good: #3f6d2a; --card: #fbf6e8;\n  --bd1: #f0c98f; --bd2: #dc9d5f; --bd-line: rgba(70, 40, 15, .6); --slot-bg: rgba(255, 248, 232, .45);\n  --font-display: \'Black Han Sans\', \'Noto Sans KR\', sans-serif;\n  --font-body: \'Noto Sans KR\', \'Apple SD Gothic Neo\', \'Malgun Gothic\', Roboto, system-ui, sans-serif;\n}\n@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {\n  --bg: #17110d; --surface: #241a13; --felt: #1d2a22; --ink: #f0e4c8; --muted: #b3a283; --line: #4a3a2b;\n  --brass: #d9a441; --blood: #e0604f; --good: #86b86a; --card: #efe3c4;\n  --bd1: #7a5533; --bd2: #55392a; --bd-line: rgba(255, 238, 205, .55); --slot-bg: rgba(0, 0, 0, .25); color-scheme: dark; } }\n:root[data-theme="dark"] {\n  --bg: #17110d; --surface: #241a13; --felt: #1d2a22; --ink: #f0e4c8; --muted: #b3a283; --line: #4a3a2b;\n  --brass: #d9a441; --blood: #e0604f; --good: #86b86a; --card: #efe3c4;\n  --bd1: #7a5533; --bd2: #55392a; --bd-line: rgba(255, 238, 205, .55); --slot-bg: rgba(0, 0, 0, .25); color-scheme: dark; }\nhtml, body { height: 100%; }\nbody { background: var(--bg); color: var(--ink); font-family: var(--font-body); font-size: 14px; overflow: hidden;\n  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }\n* { box-sizing: border-box; }\nbutton { font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }\nbutton:focus-visible { outline: 2px solid var(--brass); outline-offset: 2px; }\n#app { height: 100%; display: flex; flex-direction: column; gap: 8px; max-width: 560px; margin: 0 auto; padding-block: 8px; position: relative; }\n.frame { display: none; }\n\n.hd { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }\n.brand { font-family: var(--font-display); font-size: 26px; letter-spacing: 1px; color: var(--blood); line-height: 1; }\n.piles { flex: 1; display: flex; gap: 12px; color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; min-width: 0; }\n.piles span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.mini { background: transparent; border: 1px solid var(--line); border-radius: 6px; padding: 4px 10px; font-size: 12px; color: var(--muted); }\n\n/* \u2500\u2500 \uD50C\uB808\uC774\uC5B4 \uD310 \u2500\u2500 */\n.players { display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x proximity; padding: 2px 2px 6px; flex: none; position: relative; z-index: 1; }\n.bd { display: flex; flex-direction: column; gap: 5px; text-align: left; padding: 6px; border-radius: 12px; position: relative; color: #2a1c12;\n  background: linear-gradient(var(--bd1), var(--bd2)); border: 1.5px solid var(--bd-line); min-width: 0; }\n:root[data-theme="dark"] .bd, :root:not([data-theme="light"]) .bd { }\n@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .bd { color: #f3e6cb; } }\n:root[data-theme="dark"] .bd { color: #f3e6cb; }\n.players .bd { flex: none; width: 250px; scroll-snap-align: start; }\n.bd.turn { border-color: var(--brass); box-shadow: 0 0 0 2px var(--brass); }\n.bd.act::after { content: \'\'; position: absolute; top: -4px; right: -4px; width: 11px; height: 11px; border-radius: 50%; background: var(--blood); border: 2px solid var(--bg); animation: pulse 1.2s infinite; }\n.bd.dead { opacity: .45; }\n.bd.target { box-shadow: 0 0 0 3px var(--blood); }\n.bd.target.far { opacity: .5; box-shadow: none; }\n.bd-top { display: flex; align-items: center; gap: 6px; min-height: 22px; }\n.bd-name { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 64px; }\n.role { font-size: 10.5px; padding: 0 5px; border-radius: 4px; border: 1px solid currentColor; white-space: nowrap; flex: none; opacity: .9; }\n.role.sheriff { color: var(--brass); font-weight: 700; }\n.bd .role.sheriff { color: #7a4b00; } :root[data-theme="dark"] .bd .role.sheriff { color: #ffd27a; }\n@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .bd .role.sheriff { color: #ffd27a; } }\n.role.outlaw, .role.renegade { color: var(--blood); } .role.deputy { color: var(--good); }\n.bullets { display: flex; gap: 2px; margin-left: auto; flex: none; }\n.bl { width: 8px; height: 21px; overflow: visible; }\n.bl path { fill: transparent; stroke: currentColor; stroke-width: 1.4; opacity: .55; }\n.bl.on path:first-child { fill: #c9922a; stroke: #3a2410; opacity: 1; }\n.bl.on .rim { stroke: #3a2410; opacity: 1; }\n.hc { font-size: 11px; font-variant-numeric: tabular-nums; flex: none; display: inline-flex; align-items: center; }\n.cardico { display: inline-block; width: 8px; height: 11px; border: 1.5px solid currentColor; border-radius: 2px; margin-right: 3px; }\n.dist { color: var(--blood); font-weight: 800; font-size: 11px; flex: none; background: rgba(255,255,255,.8); border-radius: 4px; padding: 0 4px; }\n.gone { margin-left: auto; font-size: 12px; font-weight: 700; }\n.bd-slots { display: grid; grid-template-columns: 1fr 1.15fr 1fr; gap: 5px; min-height: 0; }\n.sl { border: 1.5px solid var(--bd-line); border-radius: 8px; background: var(--slot-bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 3px; position: relative; overflow: hidden; min-width: 0; min-height: 64px; }\n.sl .n { font-size: 10px; line-height: 1.1; text-align: center; max-width: 100%; }\n.bd .sl-ch .av.lg { width: 38px; height: 38px; float: none; margin: 0; }\n.sl-eq { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; align-content: center; }\n.eq { position: relative; aspect-ratio: 1; border: 1px dashed var(--bd-line); border-radius: 3px; overflow: hidden; }\n.eq .si { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: .3; filter: grayscale(1); }\n.eq.on { border: 1.5px solid #2a1c12; } .eq.on .si { opacity: 1; filter: none; }\n.eq.bad.on { border-color: var(--blood); box-shadow: 0 0 0 1.5px var(--blood); }\n.sl-wp .wpic { display: block; width: 100%; aspect-ratio: 240 / 156; background-size: 100% 100%; border-radius: 3px; border: 1px solid #2a1c12; }\n.rg { position: absolute; right: 3px; top: 2px; font-style: normal; font-weight: 800; font-size: 11px; width: 15px; height: 15px; line-height: 15px; text-align: center; border-radius: 50%; background: #2a1c12; color: #f6eed9; }\n\n/* \uB0B4 \uD310 / \uC815\uBCF4 \uC2DC\uD2B8\uC758 \uD310 */\n.bd.me { width: 100%; }\n.bd.me .sl { min-height: 0; flex-direction: row; padding: 2px 4px; }\n.bd.me .bd-slots { grid-template-columns: auto 1fr auto; }\n.bd.me .sl .n { display: none; }\n.bd.me .sl-ch .av.lg { width: 28px; height: 28px; }\n.bd.me .sl-eq { grid-template-columns: repeat(5, 1fr); }\n.bd.me .sl-wp .wpic { width: 52px; }\n.bd.inset .bd-slots { margin-bottom: 4px; }\n\n.banner { flex: none; padding: 8px 12px; border-radius: 8px; background: var(--surface); border: 1px solid var(--line); color: var(--muted); text-wrap: balance; position: relative; z-index: 1; }\n.banner.mine { background: var(--brass); border-color: var(--brass); color: #1b1208; font-weight: 700; }\n.info { display: contents; }\n.log { flex: 1; min-height: 40px; overflow-y: auto; font-size: 12px; color: var(--muted); background: var(--felt); border-radius: 8px; padding: 8px 10px; position: relative; z-index: 1; }\n.log div { padding: 1px 0; } .log div:last-child { color: var(--ink); }\n.cdesc { font-size: 12.5px; color: var(--muted); line-height: 1.4; position: relative; z-index: 1; }\n.cdesc b { color: var(--ink); margin-right: 4px; }\n.cdesc.l { display: none; }\n\n.me { flex: none; display: flex; flex-direction: column; gap: 6px; position: relative; z-index: 1; }\n.mypanel { display: flex; flex-direction: column; gap: 6px; }\n.bar { display: flex; gap: 8px; min-height: 44px; } .bar:empty { min-height: 0; }\n.btn { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 0 14px; min-height: 44px; font-weight: 700; flex: 1; }\n.btn.primary { background: var(--blood); border-color: var(--blood); color: #fff; }\n.btn.danger { border-color: var(--blood); color: var(--blood); }\n.btn.ghost { background: transparent; }\n.btn:disabled { opacity: .4; cursor: default; }\n.btn.wide { width: 100%; text-align: left; font-weight: 500; }\n.btn.big { min-height: 54px; font-size: 17px; flex: none; width: 100%; }\n\n.hand { display: flex; gap: 8px; overflow-x: auto; padding: 20px 4px 6px; min-height: 160px; align-items: flex-end; }\n.hand .empty { color: var(--muted); align-self: center; }\n.card { flex: none; width: 92px; height: 132px; background: var(--card); color: #2a1c12; border: 1px solid #8b7550; border-radius: 8px; padding: 6px;\n  display: flex; flex-direction: column; text-align: left; gap: 4px; position: relative; transition: transform .12s; }\n.card.red .corner { color: #a3281c; }\n.card .corner { font-weight: 700; font-size: 13px; font-variant-numeric: tabular-nums; }\n.card .nm { font-family: var(--font-display); font-size: 17px; line-height: 1.1; text-wrap: balance; }\n.card .ds { font-size: 10.5px; line-height: 1.3; color: #5a4733; }\n.card.sel { transform: translateY(-12px); outline: 3px solid var(--brass); }\n.card.sm { width: 104px; height: 144px; }\n.card.art { padding: 0; overflow: hidden; gap: 0; }\n.card.art .pic { display: block; width: 100%; aspect-ratio: 240 / 156; background-size: 100% 100%; border-bottom: 1px solid #8b7550; }\n.card.art .corner { position: absolute; bottom: 4px; right: 6px; font-size: 12px; }\n.card.art .nm { padding: 5px 6px 0; font-size: 16px; }\n.row { display: flex; gap: 8px; overflow-x: auto; padding: 4px 2px 8px; }\n.col { display: flex; flex-direction: column; gap: 8px; margin: 8px 0; }\n\n.av { border-radius: 50%; object-fit: cover; flex: none; border: 1px solid var(--line); background: var(--felt); }\n.av.sm { width: 22px; height: 22px; } .av.md { width: 46px; height: 46px; } .av.lg { width: 96px; height: 96px; float: right; margin: 0 0 8px 12px; }\n\n.scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, .45); z-index: 3; }\n.scrim.dark { background: rgba(0, 0, 0, .7); }\n.sheet { position: fixed; left: 0; right: 0; bottom: 0; max-width: 560px; margin: 0 auto; background: var(--surface); border-top: 2px solid var(--brass); z-index: 4;\n  border-radius: 16px 16px 0 0; padding: 12px max(16px, env(safe-area-inset-left, 0px)) calc(16px + env(safe-area-inset-bottom, 0px)); max-height: 80%; overflow-y: auto; }\n.sheet .grab { width: 40px; height: 4px; border-radius: 2px; background: var(--line); margin: 0 auto 10px; }\n.sheet h3 { margin: 0 0 6px; font-size: 17px; text-wrap: balance; }\n.sheet h3 small { color: var(--muted); font-weight: 400; font-size: 12px; }\n.sheet h4 { margin: 10px 0 4px; font-size: 12px; color: var(--muted); clear: both; }\n.sheet p { margin: 4px 0 10px; line-height: 1.5; }\n.end { position: fixed; left: 16px; right: 16px; top: 50%; transform: translateY(-50%); max-width: 420px; margin: 0 auto; background: var(--surface); z-index: 4;\n  border: 2px solid var(--brass); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 8px; max-height: 90%; overflow-y: auto; }\n.end h2 { font-family: var(--font-display); font-size: 28px; margin: 0; color: var(--blood); font-weight: 400; }\n.end .win { color: var(--good); font-weight: 700; margin: 0; } .end .lose { color: var(--muted); margin: 0; }\n.end ul { list-style: none; margin: 4px 0 8px; padding: 0; display: flex; flex-direction: column; gap: 4px; font-size: 13px; }\n.toast { position: fixed; left: 50%; top: calc(12px + env(safe-area-inset-top, 0px)); transform: translate(-50%, -80px); background: #2a1c12; color: #f6eed9; padding: 10px 14px; border-radius: 8px; z-index: 6;\n  transition: transform .2s; max-width: calc(100% - 32px); font-weight: 500; }\n.toast.show { transform: translate(-50%, 0); }\n\n.menu { margin: auto 0; display: flex; flex-direction: column; gap: 18px; }\n.poster { border: 2px solid var(--ink); padding: 22px 18px; background: var(--surface); outline: 1px solid var(--ink); outline-offset: 4px; text-align: center; }\n.eyebrow { margin: 0; letter-spacing: 6px; font-size: 12px; color: var(--muted); }\n.poster h1 { font-family: var(--font-display); font-weight: 400; font-size: 96px; line-height: 1; margin: 6px 0; color: var(--blood); }\n.sub { margin: 0; color: var(--muted); text-wrap: balance; line-height: 1.5; }\n.count p { margin: 0 0 8px; color: var(--muted); font-size: 12px; } .count div { display: flex; gap: 8px; }\n.seg { flex: 1; min-height: 46px; border: 1px solid var(--line); background: var(--surface); border-radius: 10px; font-weight: 700; }\n.seg.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }\n.notes { margin: 0; padding-left: 18px; color: var(--muted); line-height: 1.7; font-size: 13px; }\n.poster.hasimg { background-size: cover; background-position: center; border-color: var(--brass); }\n.poster.hasimg h1, .poster.hasimg .sub, .poster.hasimg .eyebrow { color: #f6eed9; text-shadow: 0 1px 6px rgba(0,0,0,.7); }\nbody.hasbg::before { content: \'\'; position: fixed; inset: 0; background: var(--bgimg) center / cover; opacity: .18; pointer-events: none; z-index: -1; }\n@keyframes pulse { 50% { opacity: .3; } }\n\n/* \u2500\u2500 \uC138\uB85C \uC804\uC6A9: \uC0C1\uB300 \uD310 2\uC5F4 \uD55C\uB208\uC5D0 \u2500\u2500 */\nhtml { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }\nbutton { touch-action: manipulation; }\nbody { font-family: var(--font-body); padding-left: max(8px, env(safe-area-inset-left, 0px)); padding-right: max(8px, env(safe-area-inset-right, 0px)); }\n#app { height: 100%; max-width: 520px; gap: 5px; padding-block: 4px; }\n.hd { gap: 8px; min-height: 28px; } .brand { font-size: 22px; } .mini { padding: 3px 8px; }\n.players { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: auto; gap: 5px; overflow: visible; padding: 0; flex: none; align-content: start; }\n.players .bd { width: auto; }\n.bd.opp, .bd.me { display: grid; grid-template-columns: 38px minmax(0, 1fr); grid-template-areas: "av l1" "av l2" "av l3" "av l4"; column-gap: 5px; row-gap: 1px; padding: 4px 5px; align-content: center; border-radius: 10px; align-items: center; font-size: 11px; }\n.bd .cav { grid-area: av; align-self: start; } .bd .cav .av { width: 38px; height: 38px; float: none; margin: 0; }\n.bd .l1 { grid-area: l1; display: flex; align-items: center; gap: 4px; min-width: 0; }\n.bd .l2 { grid-area: l2; display: flex; align-items: center; gap: 4px; min-width: 0; }\n.bd .l3 { grid-area: l3; display: flex; gap: 2px; }\n.bd .l4 { grid-area: l4; display: flex; align-items: center; gap: 4px; min-width: 0; font-size: 10px; line-height: 1.2; }\n.bd .l4 .cn { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: .85; }\n.bd .bd-name { font-size: 12px; max-width: none; min-width: 0; flex: 0 1 auto; }\n.bd .role { font-size: 9.5px; padding: 0 3px; }\n.bd .hc { margin-left: auto; font-size: 11px; }\n.bd .bullets { margin-left: 0; gap: 1px; } .bd .bl { width: 7px; height: 17px; }\n.bd .wp { margin-left: auto; flex: none; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; gap: 2px; padding: 0 4px 0 2px; border: 1px solid var(--bd-line); border-radius: 9px; background: var(--slot-bg); white-space: nowrap; line-height: 16px; }\n.bd .wp b { width: 13px; height: 13px; line-height: 13px; border-radius: 50%; background: #2a1c12; color: #f6eed9; text-align: center; font-size: 9px; }\n.bd .l3 .eq { width: 17px; height: 17px; aspect-ratio: auto; flex: none; }\n.bd .gone { margin-left: 0; }\n.bd .dist { font-size: 10px; padding: 0 3px; flex: none; }\n.bd.me { width: 100%; grid-template-columns: 40px minmax(0, 1fr) auto; grid-template-areas: "av l1 l3" "av l2 l3" "av l4 l3"; }\n.bd.me .cav .av { width: 40px; height: 40px; }\n.bd.me .l3 .eq { width: 22px; height: 22px; }\n.bd.me .l3 { align-self: center; }\n.banner { padding: 5px 8px; font-size: 12.5px; line-height: 1.35; }\n.info { display: flex; flex-direction: column; gap: 4px; flex: none; min-height: 0; position: relative; z-index: 1; }\n.info .banner { flex: none; }\n.log { flex: none; height: calc(5 * (1.4em + 2px) + 14px); line-height: 1.4; font-size: 11px; padding: 4px 8px; }\n.cdesc.p { display: none; } .cdesc.l { display: block; font-size: 11.5px; line-height: 1.3; max-height: 2.7em; overflow: hidden; flex: none; }\n.me { gap: 4px; padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px)); } .mypanel { gap: 4px; }\n.bar { min-height: 38px; gap: 6px; } .btn { min-height: 38px; font-size: 13px; padding: 0 10px; }\n.hand { gap: 5px; padding: 12px 2px 4px; min-height: 0; -webkit-overflow-scrolling: touch; }\n.card { width: 62px; height: 90px; padding: 4px; border-radius: 6px; }\n.card .nm { font-size: 13px; } .card .corner { font-size: 11px; } .card .ds { display: none; }\n.card.art .nm { padding: 3px 4px 0; font-size: 12px; } .card.art .corner { bottom: 2px; right: 4px; font-size: 10px; }\n.card.sel { transform: translateY(-10px); }\n.card.sm { width: 84px; height: 116px; }\n.mh { margin: 0 0 8px; padding: 4px 6px 6px; border-radius: 8px; background: var(--felt); }\n.mh-t { font-size: 11px; color: var(--muted); }\n.mh-r { display: flex; gap: 4px; overflow-x: auto; padding-top: 3px; }\n.mc { flex: none; width: 46px; height: 62px; background: var(--card); color: #2a1c12; border: 1px solid #8b7550; border-radius: 4px; position: relative; overflow: hidden; display: flex; flex-direction: column; }\n.mc .mp { display: block; width: 100%; aspect-ratio: 240 / 156; background-size: 100% 100%; }\n.mc .mn { font-size: 8.5px; font-weight: 700; line-height: 1.1; padding: 1px 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.mc .mf { position: absolute; right: 2px; bottom: 1px; font-size: 9px; font-weight: 700; }\n.mc.red .mf { color: #a3281c; }\n.sheet { max-height: 75%; } .sheet > .btn { width: 100%; }\n.online { display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }\n.online p { margin: 0; font-size: 12px; color: var(--muted); }\n.online input { min-height: 44px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); color: var(--ink); padding: 0 10px; font: inherit; font-size: 16px; }\n.poster h1.code { font-size: 64px; letter-spacing: 6px; }\n.plist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }\n.plist li { padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); display: flex; gap: 6px; align-items: center; }\n.plist li.off { opacity: .45; }\n.menu { overflow-y: auto; max-height: 100%; padding: 4px 0; }\n@media (max-width: 350px) { .card { width: 56px; height: 82px; } .bd .l3 .eq { width: 15px; height: 15px; } }\n@media (min-width: 400px) { .card { width: 66px; height: 96px; } }\n@media (orientation: landscape) and (max-height: 520px) {\n  #app { visibility: hidden; }\n  body::after { content: \'\uD654\uBA74\uC744 \uC138\uB85C\uB85C \uB3CC\uB824 \uC8FC\uC138\uC694\'; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 22px; color: var(--ink); background: var(--bg); z-index: 20; }\n}\n\n@media (prefers-reduced-motion: reduce) { .bd.act::after { animation: none; } .card { transition: none; } .toast { transition: none; } }\n</style>\n<div id="app"></div>\n<div class="toast" id="toast" role="alert"></div>\n<script>window.__IMG={};"use strict";(()=>{var xe={J:11,Q:12,K:13,A:14},ve=t=>xe[t]??Number(t);function Ce(t){let e=t.slice(-1);return[ve(t.slice(0,-1)),e]}function ct(t,e,a){let r=[];for(let n=t;n<=e;n++)r.push(`${n}${a}`);return r}var zt=(t,e)=>e.map(a=>`${a}${t}`),qt={bang:["AS",...ct(2,10,"D"),...zt("D",["J","Q","K","A"]),...ct(2,9,"C"),"AH","KH","QH"],missed:[...ct(10,10,"C"),...zt("C",["J","Q","K","A"]),...ct(2,8,"S")],beer:ct(6,10,"H").concat(["JH"]),panic:["JH","QH","AH","8D"],catbalou:["KH","9D","10D","JD"],stagecoach:["9S","9S"],wellsfargo:["3H"],generalstore:["9C","QS"],gatling:["10H"],indians:["KD","AD"],duel:["QD","JS","8C"],saloon:["5H"],jail:["10S","JS","4H"],dynamite:["2H"],barrel:["QS","KS"],appaloosa:["AS"],mustang:["8H","9H"],schofield:["JC","QC","KS"],remington:["KC"],carabine:["AC"],winchester:["8S"],volcanic:["10S","10C"]},oa=Object.fromEntries(Object.entries(qt).map(([t,e])=>[t,e.length]));function Ft(){let t=[],e=1;for(let[a,r]of Object.entries(qt))for(let n of r){let[s,o]=Ce(n);t.push({id:e++,kind:a,suit:o,rank:s})}return t}var F={volcanic:1,schofield:2,remington:3,carabine:4,winchester:5},Zt=["dynamite","barrel","appaloosa","mustang",...Object.keys(F)],V=[{id:"bartcassidy",name:"\\uBC14\\uD2B8 \\uCE90\\uC2DC\\uB514",hp:4,text:"\\uC0DD\\uBA85\\uC744 1\\uC810 \\uC783\\uC744 \\uB54C\\uB9C8\\uB2E4 \\uB371\\uC5D0\\uC11C \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uBF51\\uB294\\uB2E4."},{id:"blackjack",name:"\\uBE14\\uB799 \\uC7AD",hp:4,text:"\\uB4DC\\uB85C\\uC6B0 \\uB54C \\uB450 \\uBC88\\uC9F8 \\uCE74\\uB4DC\\uB97C \\uACF5\\uAC1C\\uD55C\\uB2E4. \\uD558\\uD2B8/\\uB2E4\\uC774\\uC544\\uBAAC\\uB4DC\\uBA74 1\\uC7A5 \\uB354 \\uBF51\\uB294\\uB2E4."},{id:"calamityjanet",name:"\\uCE98\\uB7EC\\uBA38\\uD2F0 \\uC7AC\\uB2DB",hp:4,text:"\\uBC45!\\uACFC \\uBE57\\uB098\\uAC10!\\uC744 \\uC11C\\uB85C \\uB300\\uC2E0\\uD574\\uC11C \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uB2E4."},{id:"elgringo",name:"\\uC5D8 \\uADF8\\uB9C1\\uACE0",hp:3,text:"\\uB2E4\\uB978 \\uD50C\\uB808\\uC774\\uC5B4\\uC5D0\\uAC8C \\uC0DD\\uBA85\\uC744 \\uC783\\uC744 \\uB54C\\uB9C8\\uB2E4 \\uADF8 \\uD50C\\uB808\\uC774\\uC5B4\\uC758 \\uC190\\uC5D0\\uC11C \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uAC00\\uC838\\uC628\\uB2E4."},{id:"jessejones",name:"\\uC81C\\uC2DC \\uC874\\uC2A4",hp:4,text:"\\uCCAB \\uBC88\\uC9F8 \\uCE74\\uB4DC\\uB97C \\uB371 \\uB610\\uB294 \\uB2E4\\uB978 \\uD50C\\uB808\\uC774\\uC5B4\\uC758 \\uC190\\uC5D0\\uC11C \\uBF51\\uC744 \\uC218 \\uC788\\uB2E4."},{id:"jourdonnais",name:"\\uC870\\uB974\\uB3C4\\uB124",hp:4,text:"\\uD56D\\uC0C1 \\uD1B5(Barrel)\\uC744 \\uAC00\\uC9C4 \\uAC83\\uC73C\\uB85C \\uCDE8\\uAE09\\uD55C\\uB2E4. \\uC2E4\\uC81C \\uD1B5\\uACFC \\uD568\\uAED8 \\uC4F0\\uBA74 \\uD310\\uC815\\uC774 2\\uBC88\\uC774\\uB2E4."},{id:"kitcarlson",name:"\\uD0A4\\uD2B8 \\uCE7C\\uC2A8",hp:4,text:"\\uB371 \\uC704 3\\uC7A5\\uC744 \\uBCF4\\uACE0 2\\uC7A5\\uC744 \\uAC00\\uC838\\uAC00\\uBA70 1\\uC7A5\\uC740 \\uB371 \\uC704\\uC5D0 \\uB3CC\\uB824\\uB193\\uB294\\uB2E4."},{id:"luckyduke",name:"\\uB7ED\\uD0A4 \\uB4C0\\uD06C",hp:4,text:\'"Draw!" \\uD310\\uC815 \\uB54C 2\\uC7A5\\uC744 \\uB4A4\\uC9D1\\uC5B4 \\uADF8\\uC911 \\uC720\\uB9AC\\uD55C 1\\uC7A5\\uC744 \\uACE0\\uB978\\uB2E4.\'},{id:"paulregret",name:"\\uD3F4 \\uB9AC\\uADF8\\uB81B",hp:3,text:"\\uB2E4\\uB978 \\uD50C\\uB808\\uC774\\uC5B4\\uAC00 \\uBCFC \\uB54C \\uAC70\\uB9AC\\uAC00 +1 (\\uBB34\\uC2A4\\uD0D5\\uC744 \\uB2E8 \\uAC83\\uACFC \\uAC19\\uC74C)."},{id:"pedroramirez",name:"\\uD398\\uB4DC\\uB85C \\uB77C\\uBBF8\\uB808\\uC2A4",hp:4,text:"\\uCCAB \\uBC88\\uC9F8 \\uCE74\\uB4DC\\uB97C \\uBC84\\uB9B0 \\uB354\\uBBF8 \\uB9E8 \\uC704\\uC5D0\\uC11C \\uBF51\\uC744 \\uC218 \\uC788\\uB2E4."},{id:"rosedoolan",name:"\\uB85C\\uC988 \\uB450\\uB7F0",hp:4,text:"\\uB2E4\\uB978 \\uD50C\\uB808\\uC774\\uC5B4\\uB97C \\uBCFC \\uB54C \\uAC70\\uB9AC\\uAC00 -1 (\\uC544\\uD314\\uB8E8\\uC0AC\\uB97C \\uB080 \\uAC83\\uACFC \\uAC19\\uC74C)."},{id:"sidketchum",name:"\\uC2DC\\uB4DC \\uCF00\\uCCA8",hp:4,text:"\\uC190\\uD328 2\\uC7A5\\uC744 \\uBC84\\uB9AC\\uACE0 \\uC0DD\\uBA85 1\\uC810\\uC744 \\uD68C\\uBCF5\\uD560 \\uC218 \\uC788\\uB2E4 (\\uD69F\\uC218 \\uC81C\\uD55C \\uC5C6\\uC74C)."},{id:"slabthekiller",name:"\\uC2AC\\uB7A9 \\uB354 \\uD0AC\\uB7EC",hp:4,text:"\\uADF8\\uC758 \\uBC45!\\uC744 \\uB9C9\\uC73C\\uB824\\uBA74 \\uBE57\\uB098\\uAC10!\\uC774 2\\uC7A5 \\uD544\\uC694\\uD558\\uB2E4."},{id:"suzylafayette",name:"\\uC218\\uC9C0 \\uB77C\\uD30C\\uC608\\uD2B8",hp:4,text:"\\uC190\\uD328\\uAC00 0\\uC7A5\\uC774 \\uB418\\uB294 \\uC989\\uC2DC \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uBF51\\uB294\\uB2E4."},{id:"vulturesam",name:"\\uBC8C\\uCC98 \\uC0D8",hp:4,text:"\\uB2E4\\uB978 \\uD50C\\uB808\\uC774\\uC5B4\\uAC00 \\uD0C8\\uB77D\\uD558\\uBA74 \\uADF8\\uC758 \\uBAA8\\uB4E0 \\uCE74\\uB4DC\\uB97C \\uAC00\\uC838\\uC628\\uB2E4."},{id:"willythekid",name:"\\uC70C\\uB9AC \\uB354 \\uD0A4\\uB4DC",hp:4,text:"\\uBC45!\\uC744 \\uD134\\uB2F9 \\uD69F\\uC218 \\uC81C\\uD55C \\uC5C6\\uC774 \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uB2E4."}],Bt={4:["sheriff","renegade","outlaw","outlaw"],5:["sheriff","renegade","outlaw","outlaw","deputy"],6:["sheriff","renegade","outlaw","outlaw","outlaw","deputy"],7:["sheriff","renegade","outlaw","outlaw","outlaw","deputy","deputy"]},Y={bang:"\\uBC45!",missed:"\\uBE57\\uB098\\uAC10!",beer:"\\uB9E5\\uC8FC",panic:"\\uAC15\\uD0C8!",catbalou:"\\uCEA3 \\uBC8C\\uB85C\\uC6B0",stagecoach:"\\uC5ED\\uB9C8\\uCC28",wellsfargo:"\\uC6F0\\uC2A4 \\uD30C\\uACE0 \\uC740\\uD589",generalstore:"\\uC7A1\\uD654\\uC810",gatling:"\\uAE30\\uAD00\\uCD1D",indians:"\\uC778\\uB514\\uC5B8!",duel:"\\uACB0\\uD22C",saloon:"\\uC8FC\\uC810",jail:"\\uAC10\\uC625",dynamite:"\\uB2E4\\uC774\\uB108\\uB9C8\\uC774\\uD2B8",barrel:"\\uC220\\uD1B5",appaloosa:"\\uC870\\uC900\\uACBD",mustang:"\\uC57C\\uC0DD\\uB9C8",schofield:"\\uC2A4\\uCF54\\uD544\\uB4DC",remington:"\\uB808\\uBC0D\\uD134",carabine:"\\uCE74\\uBE48",winchester:"\\uC708\\uCCB4\\uC2A4\\uD130",volcanic:"\\uBCFC\\uCE90\\uB2C9"};var X=class extends Error{},c=t=>{throw new X(t)};function $t(t){t.seed=t.seed+1831565813|0;let e=t.seed;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ut(t,e){for(let a=e.length-1;a>0;a--){let r=Math.floor($t(t)*(a+1));[e[a],e[r]]=[e[r],e[a]]}return e}var S=(t,e)=>t.players.find(a=>a.id===e)??c(`\\uD50C\\uB808\\uC774\\uC5B4 \\uC5C6\\uC74C: ${e}`),z=t=>t.players.filter(e=>e.alive),at=(t,e)=>t.table.some(a=>a.kind===e),nt=t=>Y[t],h=(t,e)=>{t.log.push(e),t.log.length>200&&t.log.shift()};function mt(t){return t.deck.length===0&&t.discard.length>0&&(t.deck=ut(t,t.discard.splice(0))),t.deck.pop()}function R(t,e,a){let r=[];for(let n=0;n<a;n++){let s=mt(t);if(!s)break;e.hand.push(s),r.push(s)}return r}function Q(t,e){let a=t.findIndex(r=>r.id===e);return a<0&&c("\\uD574\\uB2F9 \\uCE74\\uB4DC\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),t.splice(a,1)[0]}function Gt(t,e=Date.now()|0){let a=t.length,r=Bt[a]??c("4~7\\uBA85\\uB9CC \\uD50C\\uB808\\uC774\\uD560 \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4"),n={players:[],deck:[],discard:[],turn:0,stack:[],winner:null,seed:e,log:[]};n.deck=ut(n,Ft());let s=ut(n,[...t]),o=ut(n,[...r]),d=ut(n,V.map(u=>u.id));s.forEach((u,g)=>{let i=V.find(b=>b.id===d[g]),f=o[g],m=i.hp+(f==="sheriff"?1:0);n.players.push({id:u.id,name:u.name,role:f,character:i.id,hp:m,maxHp:m,hand:[],table:[],alive:!0,bangsPlayed:0})});for(let u of n.players)R(n,u,u.maxHp);return n.turn=n.players.findIndex(u=>u.role==="sheriff"),n.stack.push({t:"turnstart",pid:n.players[n.turn].id,step:"dynamite"}),h(n,"\\uAC8C\\uC784 \\uC2DC\\uC791! \\uBCF4\\uC548\\uAD00\\uBD80\\uD130 \\uC2DC\\uC791\\uD569\\uB2C8\\uB2E4."),N(n),n}function Se(t){let e=1;for(let a of t.table){let r=F[a.kind];r&&(e=r)}return e}function Jt(t,e,a){let r=z(t),n=r.findIndex(i=>i.id===e),s=r.findIndex(i=>i.id===a);(n<0||s<0)&&c("\\uB300\\uC0C1\\uC774 \\uC0B4\\uC544\\uC788\\uC9C0 \\uC54A\\uC2B5\\uB2C8\\uB2E4");let o=Math.abs(n-s),d=Math.min(o,r.length-o),u=r[n],g=r[s];return d+=(at(g,"mustang")?1:0)+(g.character==="paulregret"?1:0),d-=(at(u,"appaloosa")?1:0)+(u.character==="rosedoolan"?1:0),Math.max(1,d)}function At(t,e,a){let r=e.character==="luckyduke"?2:1,n=[];for(let o=0;o<r;o++){let d=mt(t);d&&n.push(d)}t.discard.push(...n);let s=n.some(a);return h(t,`${e.name} \\uD310\\uC815: ${n.map(Et).join(", ")} \\u2192 ${s?"\\uC131\\uACF5":"\\uC2E4\\uD328"}`),s}var Me={S:"\\u2660",H:"\\u2665",D:"\\u2666",C:"\\u2663"},je={11:"J",12:"Q",13:"K",14:"A"},Et=t=>`${nt(t.kind)}(${Me[t.suit]}${je[t.rank]??t.rank})`;function Ut(t){return t.hand.filter(e=>e.kind==="missed"||t.character==="calamityjanet"&&e.kind==="bang")}function ft(t){return t.hand.filter(e=>e.kind==="bang"||t.character==="calamityjanet"&&e.kind==="missed")}function Vt(t,e,a,r){let n=(at(a,"barrel")?1:0)+(a.character==="jourdonnais"?1:0);for(let s=0;s<n&&r>0;s++)At(t,a,o=>o.suit==="H")&&r--;if(r<=0){h(t,`${a.name}\\uC774(\\uAC00) \\uC220\\uD1B5\\uC73C\\uB85C \\uD53C\\uD588\\uB2E4!`);return}if(Ut(a).length===0){W(t,a,1,e);return}t.stack.push({t:"bang",src:e?.id??null,tgt:a.id,needed:r})}function W(t,e,a,r){e.hp-=a,h(t,`${e.name} \\uC0DD\\uBA85 -${a} (\\uB0A8\\uC740 \\uC0DD\\uBA85 ${e.hp})`),e.hp<=0?t.stack.push({t:"dying",tgt:e.id,src:r?.id??null,dmg:a}):Yt(t,e,a,r)}function Yt(t,e,a,r){if(e.alive&&(e.character==="bartcassidy"&&(R(t,e,a),h(t,`${e.name}: \\uCE74\\uB4DC ${a}\\uC7A5 \\uBF51\\uC74C`)),e.character==="elgringo"&&r&&r.id!==e.id))for(let n=0;n<a&&r.hand.length>0;n++){let s=r.hand.splice(Math.floor($t(t)*r.hand.length),1)[0];e.hand.push(s),h(t,`${e.name}\\uC774(\\uAC00) ${r.name}\\uC758 \\uC190\\uC5D0\\uC11C \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uAC00\\uC838\\uC634`)}}function gt(t,e,a=1){let r=e.hp;e.hp=Math.min(e.maxHp,e.hp+a),e.hp!==r&&h(t,`${e.name} \\uC0DD\\uBA85 +${e.hp-r} (${e.hp})`)}function Xt(t,e,a){e.alive=!1,e.hp=Math.min(0,e.hp),h(t,`${e.name} \\uD0C8\\uB77D! \\uC5ED\\uD560: ${He(e.role)}`);let r=[...e.hand,...e.table];e.hand=[],e.table=[];let n=z(t).find(o=>o.character==="vulturesam");n?(n.hand.push(...r),r.length&&h(t,`${n.name}\\uC774(\\uAC00) ${r.length}\\uC7A5\\uC744 \\uAC00\\uC838\\uAC10`)):t.discard.push(...r);let s=Ae(t);if(s){t.winner=s,t.stack=[],h(t,`\\uAC8C\\uC784 \\uC885\\uB8CC: ${Ie(s)} \\uC2B9\\uB9AC!`);return}a&&a.alive&&a.id!==e.id&&(e.role==="outlaw"?(R(t,a,3),h(t,`${a.name}: \\uBB34\\uBC95\\uC790 \\uCC98\\uCE58 \\uBCF4\\uC0C1\\uC73C\\uB85C 3\\uC7A5 \\uBF51\\uC74C`)):e.role==="deputy"&&a.role==="sheriff"&&(t.discard.push(...a.hand,...a.table),a.hand=[],a.table=[],h(t,"\\uBCF4\\uC548\\uAD00\\uC774 \\uBD80\\uBCF4\\uC548\\uAD00\\uC744 \\uC3D8\\uC558\\uB2E4! \\uBAA8\\uB4E0 \\uCE74\\uB4DC\\uB97C \\uBC84\\uB9BD\\uB2C8\\uB2E4.")))}var He=t=>({sheriff:"\\uBCF4\\uC548\\uAD00",deputy:"\\uBD80\\uBCF4\\uC548\\uAD00",outlaw:"\\uBB34\\uBC95\\uC790",renegade:"\\uBC30\\uC2E0\\uC790"})[t],Ie=t=>({sheriff:"\\uBCF4\\uC548\\uAD00 \\uD300",outlaws:"\\uBB34\\uBC95\\uC790 \\uD300",renegade:"\\uBC30\\uC2E0\\uC790"})[t];function Ae(t){let e=z(t);return e.some(r=>r.role==="sheriff")?e.some(r=>r.role==="outlaw"||r.role==="renegade")?null:"sheriff":e.length===1&&e[0].role==="renegade"?"renegade":"outlaws"}function rt(t){if(t.winner)return null;let e=t.stack[t.stack.length-1];if(!e)return t.players[t.turn].id;switch(e.t){case"bang":case"indians":case"dying":return e.tgt;case"duel":return e.cur;case"store":return e.order[0]??null;case"kit":case"jesse":case"pedro":return e.pid;default:return null}}function bt(t){let e=t.players.length,a=t.turn;do a=(a+1)%e;while(!t.players[a].alive);t.turn=a,t.players[a].bangsPlayed=0,t.stack.push({t:"turnstart",pid:t.players[a].id,step:"dynamite"}),h(t,`\\u2500\\u2500 ${t.players[a].name}\\uC758 \\uD134 \\u2500\\u2500`)}function Ee(t,e){let a=z(t).length>2&&e.hand.some(n=>n.kind==="beer"),r=e.character==="sidketchum"&&e.hand.length>=2;return a||r}function N(t){for(let e=0;e<1e4;e++){if(t.winner){t.stack=[];return}let a=t.stack[t.stack.length-1];if(!a){if(!t.players[t.turn].alive){bt(t);continue}Wt(t);return}switch(a.t){case"turnstart":{let r=S(t,a.pid);if(!r.alive){t.stack.pop(),bt(t);continue}if(a.step==="dynamite"){a.step="jail";let n=r.table.find(s=>s.kind==="dynamite");if(n)if(At(t,r,s=>s.suit==="S"&&s.rank>=2&&s.rank<=9))r.table.splice(r.table.indexOf(n),1),t.discard.push(n),h(t,"\\uB2E4\\uC774\\uB108\\uB9C8\\uC774\\uD2B8\\uAC00 \\uD3ED\\uBC1C\\uD588\\uB2E4!"),W(t,r,3,null);else{r.table.splice(r.table.indexOf(n),1);let s=z(t),o=s[(s.indexOf(r)+1)%s.length];o.table.push(n),h(t,`\\uB2E4\\uC774\\uB108\\uB9C8\\uC774\\uD2B8\\uAC00 ${o.name}\\uC5D0\\uAC8C \\uB118\\uC5B4\\uAC14\\uB2E4`)}continue}if(a.step==="jail"){a.step="draw";let n=r.table.find(s=>s.kind==="jail");n&&(r.table.splice(r.table.indexOf(n),1),t.discard.push(n),At(t,r,s=>s.suit==="H")?h(t,`${r.name} \\uAC10\\uC625 \\uD0C8\\uCD9C!`):(h(t,`${r.name}\\uC740(\\uB294) \\uAC10\\uC625\\uC5D0 \\uAC07\\uD600 \\uD134\\uC744 \\uAC74\\uB108\\uB701\\uB2C8\\uB2E4`),t.stack.pop(),bt(t)));continue}t.stack.pop(),Re(t,r);continue}case"multi":{let r=S(t,a.src),n;for(;a.rest.length&&!n;){let s=S(t,a.rest.shift());s.alive&&(n=s)}if(!n){t.stack.pop();continue}a.kind==="gatling"?Vt(t,r,n,1):ft(n).length===0?W(t,n,1,r):t.stack.push({t:"indians",src:r.id,tgt:n.id});continue}case"dying":{let r=S(t,a.tgt);if(r.hp>0){t.stack.pop(),Yt(t,r,a.dmg,a.src?S(t,a.src):null);continue}if(!Ee(t,r)){t.stack.pop(),Xt(t,r,a.src?S(t,a.src):null);continue}return}case"store":{if(a.order=a.order.filter(r=>S(t,r).alive),a.order.length===0||a.cards.length===0){t.discard.push(...a.cards),t.stack.pop();continue}if(a.order.length===1&&a.cards.length===1){S(t,a.order[0]).hand.push(a.cards[0]),t.stack.pop();continue}return}default:Wt(t);return}}throw new Error("advance \\uB8E8\\uD504 \\uCD08\\uACFC")}function Wt(t){let e=t.stack[t.stack.length-1];if(!(e&&["turnstart","kit","jesse","pedro","dying"].includes(e.t)))for(let a of t.players)a.alive&&a.character==="suzylafayette"&&a.hand.length===0&&(R(t,a,1),h(t,`${a.name}: \\uC190\\uD328\\uAC00 \\uBE44\\uC5B4 1\\uC7A5 \\uBF51\\uC74C`))}function Re(t,e){switch(e.character){case"jessejones":if(t.players.some(a=>a.alive&&a.id!==e.id&&a.hand.length>0)){t.stack.push({t:"jesse",pid:e.id});return}break;case"kitcarlson":{let a=[];for(let r=0;r<3;r++){let n=mt(t);n&&a.push(n)}t.stack.push({t:"kit",pid:e.id,cards:a});return}case"pedroramirez":if(t.discard.length>0){t.stack.push({t:"pedro",pid:e.id});return}break;case"blackjack":{let[a,r]=R(t,e,2);r&&(h(t,`${e.name}: \\uB450 \\uBC88\\uC9F8 \\uCE74\\uB4DC \\uACF5\\uAC1C ${Et(r)}`),(r.suit==="H"||r.suit==="D")&&R(t,e,1));return}}R(t,e,2)}function ht(t,e,a){t.winner&&c("\\uAC8C\\uC784\\uC774 \\uC774\\uBBF8 \\uB05D\\uB0AC\\uC2B5\\uB2C8\\uB2E4");let r=S(t,e);r.alive||c("\\uD0C8\\uB77D\\uD55C \\uD50C\\uB808\\uC774\\uC5B4\\uC785\\uB2C8\\uB2E4"),rt(t)!==e&&c("\\uC9C0\\uAE08\\uC740 \\uB2F9\\uC2E0\\uC774 \\uD589\\uB3D9\\uD560 \\uCC28\\uB840\\uAC00 \\uC544\\uB2D9\\uB2C8\\uB2E4");let n=t.stack[t.stack.length-1];switch(a.type){case"play":return ze(t,r,n,a),void N(t);case"respond":return Pe(t,r,n,a.cardId),void N(t);case"decline":return Qe(t,r,n),void N(t);case"pick":return Te(t,r,n,a.cardId),void N(t);case"kitReturn":return De(t,r,n,a.cardId),void N(t);case"jesseDraw":return Ke(t,r,n,a.from),void N(t);case"pedroDraw":return Le(t,r,n,a.from),void N(t);case"sid":return Ne(t,r,n,a.cardIds),void N(t);case"discard":return Oe(t,r,n,a.cardId),void N(t);case"endTurn":return _e(t,r,n),void N(t)}c("\\uC54C \\uC218 \\uC5C6\\uB294 \\uD589\\uB3D9")}function Pe(t,e,a,r){let n=e.hand.find(s=>s.id===r)??c("\\uC190\\uC5D0 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4");if(a?.t==="bang")Ut(e).includes(n)||c("\\uBE57\\uB098\\uAC10!\\uC73C\\uB85C \\uC4F8 \\uC218 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4"),Q(e.hand,r),t.discard.push(n),h(t,n.kind==="missed"?`${e.name}: \\uBE57\\uB098\\uAC10!\\uC73C\\uB85C \\uBC29\\uC5B4`:`${e.name}: ${nt(n.kind)}\\uC744(\\uB97C) \\uBE57\\uB098\\uAC10!\\uC73C\\uB85C \\uC0AC\\uC6A9`),--a.needed<=0&&t.stack.pop();else if(a?.t==="indians")ft(e).includes(n)||c("\\uBC45!\\uC73C\\uB85C \\uC4F8 \\uC218 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4"),Q(e.hand,r),t.discard.push(n),h(t,`${e.name}: ${nt(n.kind)}\\uC73C\\uB85C \\uC778\\uB514\\uC5B8\\uC744 \\uB9C9\\uC74C`),t.stack.pop();else if(a?.t==="duel"){if(ft(e).includes(n)||c("\\uBC45!\\uC73C\\uB85C \\uC4F8 \\uC218 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4"),Q(e.hand,r),t.discard.push(n),h(t,`${e.name}: \\uACB0\\uD22C\\uC5D0\\uC11C \\uBC45! \\uC751\\uC218`),a.cur=a.cur===a.src?a.tgt:a.src,ft(S(t,a.cur)).length===0){let s=S(t,a.cur),o=S(t,a.cur===a.src?a.tgt:a.src);t.stack.pop(),W(t,s,1,o)}}else c("\\uC9C0\\uAE08\\uC740 \\uC751\\uB2F5\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4")}function Qe(t,e,a){if(a?.t==="bang")t.stack.pop(),W(t,e,1,a.src?S(t,a.src):null);else if(a?.t==="indians")t.stack.pop(),W(t,e,1,S(t,a.src));else if(a?.t==="duel"){let r=S(t,a.cur===a.src?a.tgt:a.src);t.stack.pop(),W(t,e,1,r)}else a?.t==="dying"?(t.stack.pop(),Xt(t,e,a.src?S(t,a.src):null)):c("\\uD3EC\\uAE30\\uD560 \\uC218 \\uC5C6\\uB294 \\uC0C1\\uD669\\uC785\\uB2C8\\uB2E4")}function Te(t,e,a,r){a?.t!=="store"&&c("\\uC7A1\\uD654\\uC810 \\uC911\\uC774 \\uC544\\uB2D9\\uB2C8\\uB2E4");let n=a,s=Q(n.cards,r);e.hand.push(s),n.order.shift(),h(t,`${e.name}: \\uC7A1\\uD654\\uC810\\uC5D0\\uC11C ${nt(s.kind)} \\uC120\\uD0DD`)}function De(t,e,a,r){a?.t!=="kit"&&c("\\uD0A4\\uD2B8 \\uCE7C\\uC2A8\\uC758 \\uC120\\uD0DD \\uB2E8\\uACC4\\uAC00 \\uC544\\uB2D9\\uB2C8\\uB2E4");let n=a,s=Q(n.cards,r);t.deck.push(s),e.hand.push(...n.cards),t.stack.pop()}function Ke(t,e,a,r){if(a?.t!=="jesse"&&c("\\uC81C\\uC2DC \\uC874\\uC2A4\\uC758 \\uC120\\uD0DD \\uB2E8\\uACC4\\uAC00 \\uC544\\uB2D9\\uB2C8\\uB2E4"),r==="deck")R(t,e,2);else{let n=S(t,r);(!n.alive||n.id===e.id||n.hand.length===0)&&c("\\uADF8 \\uD50C\\uB808\\uC774\\uC5B4\\uC758 \\uC190\\uC5D0\\uC11C\\uB294 \\uBF51\\uC744 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),e.hand.push(n.hand.splice(Math.floor($t(t)*n.hand.length),1)[0]),h(t,`${e.name}\\uC774(\\uAC00) ${n.name}\\uC758 \\uC190\\uC5D0\\uC11C 1\\uC7A5 \\uBF51\\uC74C`),R(t,e,1)}t.stack.pop()}function Le(t,e,a,r){a?.t!=="pedro"&&c("\\uD398\\uB4DC\\uB85C \\uB77C\\uBBF8\\uB808\\uC2A4\\uC758 \\uC120\\uD0DD \\uB2E8\\uACC4\\uAC00 \\uC544\\uB2D9\\uB2C8\\uB2E4"),r==="discard"?(t.discard.length===0&&c("\\uBC84\\uB9B0 \\uB354\\uBBF8\\uAC00 \\uBE44\\uC5B4 \\uC788\\uC2B5\\uB2C8\\uB2E4"),e.hand.push(t.discard.pop()),R(t,e,1)):R(t,e,2),t.stack.pop()}function Ne(t,e,a,r){e.character!=="sidketchum"&&c("\\uC2DC\\uB4DC \\uCF00\\uCCA8\\uB9CC \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4"),r[0]===r[1]&&c("\\uC11C\\uB85C \\uB2E4\\uB978 \\uCE74\\uB4DC 2\\uC7A5\\uC774 \\uD544\\uC694\\uD569\\uB2C8\\uB2E4"),e.hp>=e.maxHp&&c("\\uC774\\uBBF8 \\uC0DD\\uBA85\\uC774 \\uAC00\\uB4DD \\uCC3C\\uC2B5\\uB2C8\\uB2E4"),a&&a.t!=="dying"&&a.t!=="bang"&&a.t!=="indians"&&a.t!=="duel"&&c("\\uC9C0\\uAE08\\uC740 \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4");let n=r.map(s=>e.hand.find(o=>o.id===s)??c("\\uC190\\uC5D0 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4"));for(let s of n)Q(e.hand,s.id),t.discard.push(s);gt(t,e)}function Oe(t,e,a,r){a&&c("\\uC9C0\\uAE08\\uC740 \\uBC84\\uB9B4 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),e.hand.length<=Math.max(e.hp,0)&&c("\\uC190\\uD328\\uAC00 \\uC0DD\\uBA85 \\uC774\\uD558\\uC774\\uBBC0\\uB85C \\uBC84\\uB9B4 \\uD544\\uC694\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),t.discard.push(Q(e.hand,r))}function _e(t,e,a){a&&c("\\uC9C0\\uAE08\\uC740 \\uD134\\uC744 \\uB05D\\uB0BC \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),e.hand.length>e.hp&&c(`\\uC190\\uD328\\uB294 \\uC0DD\\uBA85(${e.hp})\\uC7A5 \\uC774\\uD558\\uC5EC\\uC57C \\uD569\\uB2C8\\uB2E4. \\uCE74\\uB4DC\\uB97C \\uBC84\\uB9AC\\uC138\\uC694`),bt(t)}function ze(t,e,a,r){let n=e.hand.find(i=>i.id===r.cardId)??c("\\uC190\\uC5D0 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4");if(a?.t==="dying"){n.kind!=="beer"&&c("\\uC0DD\\uBA85\\uC774 0 \\uC774\\uD558\\uC77C \\uB54C\\uB294 \\uB9E5\\uC8FC\\uB9CC \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4"),z(t).length<=2&&c("2\\uBA85\\uB9CC \\uB0A8\\uC73C\\uBA74 \\uB9E5\\uC8FC\\uB294 \\uD6A8\\uACFC\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),Q(e.hand,n.id),t.discard.push(n),gt(t,e);return}a&&c("\\uC9C0\\uAE08\\uC740 \\uCE74\\uB4DC\\uB97C \\uB0BC \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4 (\\uC751\\uB2F5/\\uC120\\uD0DD \\uD544\\uC694)");let s=r.target?S(t,r.target):void 0,o=()=>(s||c("\\uB300\\uC0C1\\uC774 \\uD544\\uC694\\uD569\\uB2C8\\uB2E4"),s.alive||c("\\uD0C8\\uB77D\\uD55C \\uB300\\uC0C1\\uC785\\uB2C8\\uB2E4"),s.id===e.id&&c("\\uC790\\uAE30 \\uC790\\uC2E0\\uC740 \\uB300\\uC0C1\\uC774 \\uB420 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),s),d=()=>{Q(e.hand,n.id),t.discard.push(n)},u=()=>{let i=z(t),f=i.indexOf(e);return[...i.slice(f+1),...i.slice(0,f)]};if(n.kind==="bang"||e.character==="calamityjanet"&&n.kind==="missed"){let i=o();!(at(e,"volcanic")||e.character==="willythekid")&&e.bangsPlayed>=1&&c("\\uC774\\uBC88 \\uD134\\uC5D0\\uB294 \\uC774\\uBBF8 \\uBC45!\\uC744 \\uC0AC\\uC6A9\\uD588\\uC2B5\\uB2C8\\uB2E4"),Jt(t,e.id,i.id)>Se(e)&&c("\\uC0AC\\uAC70\\uB9AC \\uBC16\\uC785\\uB2C8\\uB2E4"),d(),e.bangsPlayed++,h(t,`${e.name} \\u2192 ${i.name}: \\uBC45!`),Vt(t,e,i,e.character==="slabthekiller"?2:1);return}switch(n.kind){case"missed":c("\\uBE57\\uB098\\uAC10!\\uC740 \\uACF5\\uACA9\\uC744 \\uBC1B\\uC558\\uC744 \\uB54C\\uB9CC \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4");break;case"beer":z(t).length<=2&&c("2\\uBA85\\uB9CC \\uB0A8\\uC73C\\uBA74 \\uB9E5\\uC8FC\\uB294 \\uD6A8\\uACFC\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),d(),gt(t,e),h(t,`${e.name}: \\uB9E5\\uC8FC`);break;case"saloon":d();for(let i of z(t))gt(t,i);h(t,`${e.name}: \\uC8FC\\uC810`);break;case"stagecoach":d(),R(t,e,2),h(t,`${e.name}: \\uC5ED\\uB9C8\\uCC28`);break;case"wellsfargo":d(),R(t,e,3),h(t,`${e.name}: \\uC6F0\\uC2A4 \\uD30C\\uACE0 \\uC740\\uD589`);break;case"panic":case"catbalou":{let i=o();n.kind==="panic"&&Jt(t,e.id,i.id)>1&&c("\\uAC15\\uD0C8!\\uC740 \\uAC70\\uB9AC 1 \\uC774\\uB0B4\\uC5D0\\uB9CC \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4");let f=r.targetCard??c("\\uAC00\\uC838\\uC62C/\\uBC84\\uB9B4 \\uCE74\\uB4DC\\uB97C \\uC9C0\\uC815\\uD574\\uC57C \\uD569\\uB2C8\\uB2E4"),m;f.zone==="hand"?(i.hand.length===0&&c("\\uC190\\uD328\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),m=i.hand.splice(Math.floor($t(t)*i.hand.length),1)[0]):m=Q(i.table,f.cardId),d(),n.kind==="panic"?(e.hand.push(m),h(t,`${e.name}\\uC774(\\uAC00) ${i.name}\\uC5D0\\uAC8C\\uC11C \\uCE74\\uB4DC\\uB97C \\uAC00\\uC838\\uC634 (\\uAC15\\uD0C8!)`)):(t.discard.push(m),h(t,`${e.name}\\uC774(\\uAC00) ${i.name}\\uC758 ${f.zone==="hand"?"\\uC190\\uD328 1\\uC7A5":nt(m.kind)}\\uC744(\\uB97C) \\uBC84\\uB9AC\\uAC8C \\uD568 (\\uCEA3 \\uBC8C\\uB85C\\uC6B0)`));break}case"generalstore":{d();let i=z(t).map(L=>L.id),f=i.indexOf(e.id),m=[...i.slice(f),...i.slice(0,f)],b=[];for(let L=0;L<m.length;L++){let dt=mt(t);dt&&b.push(dt)}t.stack.push({t:"store",cards:b,order:m}),h(t,`${e.name}: \\uC7A1\\uD654\\uC810 \\u2014 ${b.map(Et).join(", ")}`);break}case"gatling":d(),t.stack.push({t:"multi",kind:"gatling",src:e.id,rest:u().map(i=>i.id)}),h(t,`${e.name}: \\uAE30\\uAD00\\uCD1D!`);break;case"indians":d(),t.stack.push({t:"multi",kind:"indians",src:e.id,rest:u().map(i=>i.id)}),h(t,`${e.name}: \\uC778\\uB514\\uC5B8!`);break;case"duel":{let i=o();d(),h(t,`${e.name} \\u2192 ${i.name}: \\uACB0\\uD22C!`),ft(i).length===0?W(t,i,1,e):t.stack.push({t:"duel",src:e.id,tgt:i.id,cur:i.id});break}case"jail":{let i=o();i.role==="sheriff"&&c("\\uBCF4\\uC548\\uAD00\\uC5D0\\uAC8C\\uB294 \\uAC10\\uC625\\uC744 \\uAC78 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),at(i,"jail")&&c("\\uC774\\uBBF8 \\uAC10\\uC625\\uC5D0 \\uAC07\\uD600 \\uC788\\uC2B5\\uB2C8\\uB2E4"),Q(e.hand,n.id),i.table.push(n),h(t,`${e.name} \\u2192 ${i.name}: \\uAC10\\uC625!`);break}default:{if(Zt.includes(n.kind)||c("\\uC0AC\\uC6A9\\uD560 \\uC218 \\uC5C6\\uB294 \\uCE74\\uB4DC\\uC785\\uB2C8\\uB2E4"),F[n.kind]){let i=e.table.find(f=>F[f.kind]);i&&(e.table.splice(e.table.indexOf(i),1),t.discard.push(i))}else at(e,n.kind)&&c("\\uAC19\\uC740 \\uC7A5\\uBE44\\uB97C \\uC774\\uBBF8 \\uAC00\\uC9C0\\uACE0 \\uC788\\uC2B5\\uB2C8\\uB2E4");Q(e.hand,n.id),e.table.push(n),h(t,`${e.name}: ${nt(n.kind)} \\uC7A5\\uCC29`)}}}function te(t,e){let a=t.stack[t.stack.length-1],r=null;return a&&(r={...a},a.t==="kit"&&a.pid!==e&&(r.cards=a.cards.length)),{you:e,turn:t.players[t.turn].id,actor:rt(t),winner:t.winner,deckCount:t.deck.length,discardTop:t.discard[t.discard.length-1]??null,frame:r,players:t.players.map(n=>({id:n.id,name:n.name,character:n.character,hp:n.hp,maxHp:n.maxHp,alive:n.alive,handCount:n.hand.length,table:n.table,role:n.id===e||n.role==="sheriff"||!n.alive||t.winner?n.role:null,hand:n.id===e?n.hand:void 0})),log:t.log.slice(-40)}}var qe={sheriff:["outlaw","renegade","deputy"],deputy:["outlaw","renegade"],outlaw:["sheriff","deputy","renegade","outlaw"],renegade:["outlaw","sheriff","deputy"]};function ee(t,e){let a=t.players.find(i=>i.id===e),r=t.stack[t.stack.length-1],n=t.players.filter(i=>i.alive&&i.id!==e),s=qe[a.role],o=[...n].sort((i,f)=>{let m=i.role==="sheriff"&&a.role!=="sheriff"?0:1,b=f.role==="sheriff"&&a.role!=="sheriff"?0:1;return a.role==="outlaw"?m-b:Math.random()-.5}),d=[],u=a.hand,g=(...i)=>u.filter(f=>i.includes(f.kind));if(r)if(r.t==="bang"){for(let i of u)d.push({type:"respond",cardId:i.id});d.push({type:"decline"})}else if(r.t==="indians"||r.t==="duel"){for(let i of u)d.push({type:"respond",cardId:i.id});d.push({type:"decline"})}else if(r.t==="dying"){for(let i of g("beer"))d.push({type:"play",cardId:i.id});d.push({type:"decline"})}else if(r.t==="store")for(let i of r.cards)d.push({type:"pick",cardId:i.id});else if(r.t==="kit")for(let i of[...r.cards].reverse())d.push({type:"kitReturn",cardId:i.id});else r.t==="jesse"?d.push({type:"jesseDraw",from:"deck"}):r.t==="pedro"&&d.push({type:"pedroDraw",from:"deck"});else{if(a.hp<a.maxHp)for(let i of g("beer"))d.push({type:"play",cardId:i.id});for(let i of g("barrel","mustang","appaloosa","schofield","remington","carabine","winchester","dynamite"))d.push({type:"play",cardId:i.id});for(let i of g("stagecoach","wellsfargo","generalstore","gatling","indians"))d.push({type:"play",cardId:i.id});if(a.hp<a.maxHp-1)for(let i of g("saloon"))d.push({type:"play",cardId:i.id});for(let i of g("jail"))for(let f of o)d.push({type:"play",cardId:i.id,target:f.id});for(let i of g("duel"))for(let f of o)d.push({type:"play",cardId:i.id,target:f.id});for(let i of g("panic","catbalou"))for(let f of o){for(let m of f.table)d.push({type:"play",cardId:i.id,target:f.id,targetCard:{zone:"table",cardId:m.id}});d.push({type:"play",cardId:i.id,target:f.id,targetCard:{zone:"hand"}})}for(let i of g("bang"))for(let f of o)d.push({type:"play",cardId:i.id,target:f.id});d.push({type:"endTurn"});for(let i of u)d.push({type:"discard",cardId:i.id})}for(let i of d){let f=structuredClone(t);try{ht(f,e,i)}catch(m){if(m instanceof X)continue;throw m}ht(t,e,i);return}throw new Error(`\\uBD07\\uC774 \\uD589\\uB3D9\\uD560 \\uC218 \\uC5C6\\uC74C: ${JSON.stringify(r)} actor=${rt(t)}`)}var l="#1b1410";var Z=(t,e,a,r="#d6362b")=>`<path transform="translate(${t} ${e}) scale(${a})" d="M0 8 C-14 -4 -9 -16 0 -9 C9 -16 14 -4 0 8Z" fill="${r}" stroke="${l}" stroke-width="${2/a}" stroke-linejoin="round"/>`,M=(t,e,a,r="")=>`<g>${r}<circle cx="${t}" cy="${e}" r="${a}" fill="#fff" stroke="${l}" stroke-width="${Math.max(3,a/7)}"/>\n  <ellipse cx="${t-a*.36}" cy="${e-a*.18}" rx="${a*.15}" ry="${a*.17}" fill="${l}"/>\n  <ellipse cx="${t+a*.34}" cy="${e-a*.2}" rx="${a*.18}" ry="${a*.21}" fill="${l}"/></g>`,O=(t,e,a,r="#8b5a2b")=>`<g><ellipse cx="${t}" cy="${e-a*.82}" rx="${a*1.25}" ry="${a*.2}" fill="${r}" stroke="${l}" stroke-width="3"/>\n  <rect x="${t-a*.62}" y="${e-a*1.42}" width="${a*1.24}" height="${a*.6}" rx="${a*.18}" fill="${r}" stroke="${l}" stroke-width="3"/></g>`,T=(t,e,a,r,n=l,s=4,o="")=>{let d=Math.atan2(r-e,a-t),u=11,g=i=>`${a-u*Math.cos(d+i)},${r-u*Math.sin(d+i)}`;return`<g stroke="${n}" stroke-width="${s}" stroke-linecap="round" fill="${n}"><line x1="${t}" y1="${e}" x2="${a-4*Math.cos(d)}" y2="${r-4*Math.sin(d)}" ${o?`stroke-dasharray="${o}"`:""}/><polygon points="${a},${r} ${g(.5)} ${g(-.5)}" stroke="none"/></g>`},kt=(t,e,a=1,r=!1,n=34)=>`<g transform="translate(${t} ${e}) scale(${r?-a:a} ${a})" stroke="${l}" stroke-width="3" stroke-linejoin="round">\n  <rect x="6" y="-7" width="${n}" height="9" rx="2" fill="#6b6b6b"/><rect x="-6" y="-9" width="20" height="14" rx="3" fill="#8a8a8a"/>\n  <polygon points="-4,4 8,4 4,24 -8,22" fill="#7a4a24"/></g>`,B=(t,e,a=26,r=36,n=0,s="#fbf6e8",o="")=>`<g transform="translate(${t} ${e}) rotate(${n})"><rect x="${-a/2}" y="${-r/2}" width="${a}" height="${r}" rx="4" fill="${s}" stroke="${l}" stroke-width="3"/>${o}</g>`,E=(t,e,a,r=26,n=l,s="middle")=>`<text x="${t}" y="${e}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${r}" text-anchor="${s}" fill="${n}" stroke="#fff" stroke-width="${r/9}" paint-order="stroke">${a}</text>`,Rt=(t,e,a=16)=>{let r=[];for(let n=0;n<16;n++){let s=n*Math.PI/8,o=n%2?a*.5:a;r.push(`${t+o*Math.cos(s)},${e+o*Math.sin(s)}`)}return`<polygon points="${r.join(" ")}" fill="#ffd23f" stroke="${l}" stroke-width="2.5"/>`},Fe=(t,e,a,r,n)=>Array.from({length:n},(s,o)=>`<rect x="${t+o*(a-8)/(n-1)}" y="${e}" width="8" height="${r}" rx="3" fill="#59616b" stroke="${l}" stroke-width="2.5"/>`).join(""),y=(t,e)=>`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t}"/><stop offset="1" stop-color="${e}"/></linearGradient></defs><rect width="240" height="156" fill="url(#g)"/>`,st=["#f6c9a8","#e9a177"],ae=["#bfe0f5","#8cc3e6"],ne=["#cdeab5","#a6d78a"],Pt=["#f7e3a1","#eecb62"],G=["#e3d5bd","#c9b48e"],re=["#d9c6d9","#b99bbd"];function it(t,e,a=""){let r="";for(let n=0;n<=5;n++){let s=28+n*37,o=n>=1&&n<=t;r+=`<g opacity="${n===0||o?1:.35}">${M(s,112,15,n===0?O(s,112,15,"#8b5a2b"):"")}</g>`,n>=1&&(r+=`<circle cx="${s}" cy="112" r="20" fill="none" stroke="${o?"#2f8f3a":"transparent"}" stroke-width="3.5"/>${E(s,148,String(n),14,o?"#1f6b2a":"#777")}`)}return`${kt(60,38,1.4,!1,e)}${a}${r}`}var yt={bang:()=>y(...st)+kt(62,82,1.3,!1,34)+Rt(118,78,15)+M(40,92,22,O(40,92,22))+T(132,80,168,80,"#444",4,"3 6")+M(200,92,22)+Z(200,44,1.6)+E(200,28,"\\u22121",20,"#d6362b"),missed:()=>y(...ae)+M(150,92,26,O(150,92,26,"#5a7aa0"))+`<path d="M20 40 Q90 18 148 34" fill="none" stroke="#444" stroke-width="4" stroke-dasharray="3 7" stroke-linecap="round"/><g transform="translate(160 34) rotate(18)"><rect x="-4" y="-8" width="22" height="16" rx="3" fill="#c9922a" stroke="${l}" stroke-width="2.5"/><path d="M18 -8 L30 0 L18 8Z" fill="#b87333" stroke="${l}" stroke-width="2.5"/></g><circle cx="204" cy="40" r="20" fill="#3aa655" stroke="${l}" stroke-width="3"/><path d="M194 40 L202 48 L216 31" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M92 80 l-22 0 M92 96 l-30 0 M92 112 l-18 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,beer:()=>y(...ne)+`<path d="M126 62 q34 -2 34 22 q0 24 -34 22" fill="none" stroke="${l}" stroke-width="9"/><path d="M126 62 q34 -2 34 22 q0 24 -34 22" fill="none" stroke="#f3f3f3" stroke-width="3.5"/><rect x="72" y="50" width="62" height="86" rx="9" fill="#f0a82e" stroke="${l}" stroke-width="4"/><rect x="82" y="66" width="8" height="58" rx="4" fill="#fff" opacity=".45"/><circle cx="84" cy="48" r="14" fill="#fff" stroke="${l}" stroke-width="3.5"/><circle cx="103" cy="42" r="16" fill="#fff" stroke="${l}" stroke-width="3.5"/><circle cx="122" cy="48" r="13" fill="#fff" stroke="${l}" stroke-width="3.5"/>`+Z(196,56,2.2)+E(196,100,"+1",26,"#2c7a1f"),panic:()=>y(...st)+M(44,78,24,O(44,78,24,"#5a7aa0"))+M(196,78,24)+B(120,70,28,38,-12)+T(172,58,76,58,"#d6362b",5)+`<line x1="44" y1="130" x2="196" y2="130" stroke="${l}" stroke-width="3"/><line x1="44" y1="122" x2="44" y2="138" stroke="${l}" stroke-width="3"/><line x1="196" y1="122" x2="196" y2="138" stroke="${l}" stroke-width="3"/>`+E(120,146,"\\uAC70\\uB9AC 1",15).replace("\\uAC70\\uB9AC 1","1"),catbalou:()=>y(...st)+M(40,80,24,O(40,80,24,"#5a7aa0"))+T(70,70,120,70,"#444",4,"3 6")+B(160,78,52,72,8)+\'<path d="M140 52 L182 106 M182 52 L140 106" stroke="#d6362b" stroke-width="10" stroke-linecap="round"/><path d="M80 128 q40 18 80 0" fill="none" stroke="#444" stroke-width="3" stroke-dasharray="2 6"/>\'+E(40,136,"\\u221E",24).replace("\\u221E","\\u221E"),stagecoach:()=>y(...Pt)+`<rect x="40" y="62" width="108" height="46" rx="8" fill="#b9733a" stroke="${l}" stroke-width="4"/><rect x="52" y="40" width="84" height="26" rx="6" fill="#9b5f2c" stroke="${l}" stroke-width="4"/><rect x="62" y="74" width="26" height="20" rx="3" fill="#cfe9f7" stroke="${l}" stroke-width="3"/><rect x="98" y="74" width="26" height="20" rx="3" fill="#cfe9f7" stroke="${l}" stroke-width="3"/>`+[66,128].map(t=>`<g><circle cx="${t}" cy="116" r="19" fill="#fff" stroke="${l}" stroke-width="4"/><path d="M${t-17} 116H${t+17}M${t} 99V133M${t-12} 104L${t+12} 128M${t+12} 104L${t-12} 128" stroke="${l}" stroke-width="2.5"/></g>`).join("")+B(186,50,30,42,-10)+B(206,62,30,42,10)+E(196,124,"+2",28,"#2c5f9e"),wellsfargo:()=>y(...Pt)+`<polygon points="30,60 100,26 170,60" fill="#d8cfc0" stroke="${l}" stroke-width="4"/>`+[44,70,96,122,148].map(t=>`<rect x="${t}" y="64" width="12" height="48" fill="#f4efe6" stroke="${l}" stroke-width="3"/>`).join("")+`<rect x="26" y="112" width="148" height="14" fill="#c9bfae" stroke="${l}" stroke-width="4"/><circle cx="100" cy="46" r="9" fill="#ffd23f" stroke="${l}" stroke-width="2.5"/>`+E(100,51,"$",13)+B(198,50,28,40,-12)+B(208,62,28,40,6)+B(218,76,28,40,18)+E(196,138,"+3",28,"#2c5f9e"),generalstore:()=>y(...Pt)+`<path d="M50 26 H190 L200 52 H40Z" fill="#e45a4a" stroke="${l}" stroke-width="4"/>`+[60,90,120,150,180].map(t=>`<path d="M${t} 26 L${t-8} 52" stroke="#fff" stroke-width="7"/>`).join("")+[60,100,140,180].map((t,e)=>B(t,78,28,38,(e-1.5)*9)).join("")+[50,120,190].map(t=>M(t,132,14)+T(t,112,t,100,"#444",3)).join(""),gatling:()=>y(...st)+M(34,82,20,O(34,82,20))+`<g transform="translate(70 80)"><rect x="0" y="-18" width="52" height="36" rx="6" fill="#7b7b7b" stroke="${l}" stroke-width="3.5"/>`+[-12,-4,4,12].map(t=>`<line x1="0" y1="${t}" x2="52" y2="${t}" stroke="${l}" stroke-width="3"/>`).join("")+"</g>"+[32,78,124].map(t=>T(130,80,170,t,"#444",3.5,"3 5")).join("")+[32,78,124].map(t=>M(198,t,16)).join("")+[32,78,124].map(t=>Z(224,t-18,1)).join(""),indians:()=>y(...st)+[44,120,196].map(t=>`<g><line x1="${t-14}" y1="14" x2="${t}" y2="64" stroke="#7a4a24" stroke-width="5"/><polygon points="${t},72 ${t-10},58 ${t+4},54" fill="#555" stroke="${l}" stroke-width="2.5"/><path d="M${t-20} 14 l8 -4 l-2 10z" fill="#d6362b"/></g>`).join("")+[44,120,196].map(t=>M(t,112,22)).join("")+[44,120,196].map(t=>Z(t+22,80,1.1)).join("")+E(120,150,"\\u22121",1,"#fff").replace("\\u22121",""),duel:()=>y(...st)+M(46,94,24,O(46,94,24))+M(194,94,24,O(194,94,24,"#222"))+kt(76,88,1.2,!1,22)+kt(164,88,1.2,!0,22)+`<path d="M112 40 l-10 26 h14 l-8 26 l26 -34 h-16 l10 -18z" fill="#ffd23f" stroke="${l}" stroke-width="3" stroke-linejoin="round"/>`+T(100,132,140,132,"#444",3)+T(140,144,100,144,"#444",3),saloon:()=>y(...ne)+`<rect x="48" y="52" width="144" height="88" fill="#6e4a2b" stroke="${l}" stroke-width="4"/><path d="M52 66 H118 V126 H52Z" fill="#c98b4a" stroke="${l}" stroke-width="4" transform="skewY(-3)"/><path d="M122 66 H188 V126 H122Z" fill="#c98b4a" stroke="${l}" stroke-width="4" transform="skewY(3) translate(0 -8)"/>`+[74,96].map(t=>`<line x1="${t}" y1="64" x2="${t}" y2="124" stroke="${l}" stroke-width="2.5" opacity=".6"/>`).join("")+Z(74,30,1.5)+Z(120,22,1.5)+Z(166,30,1.5)+E(120,48,"+1",1,"#fff").replace("+1",""),jail:()=>y(...re)+M(120,86,40,O(120,86,40,"#8b5a2b"))+Fe(52,20,136,118,6)+`<rect x="102" y="104" width="36" height="28" rx="5" fill="#ffd23f" stroke="${l}" stroke-width="3.5"/><path d="M108 104 v-10 a12 12 0 0 1 24 0 v10" fill="none" stroke="${l}" stroke-width="4"/><g transform="translate(200 40)"><circle r="18" fill="#fff" stroke="${l}" stroke-width="3"/><path d="M0 -10 V0 L8 6" fill="none" stroke="${l}" stroke-width="3.5" stroke-linecap="round"/><path d="M-20 -20 L20 20" stroke="#d6362b" stroke-width="5"/></g>`,dynamite:()=>y(...re)+[78,108,138].map((t,e)=>`<rect x="${t}" y="${58+(e===1?-6:0)}" width="26" height="78" rx="5" fill="#d6362b" stroke="${l}" stroke-width="4"/>`).join("")+`<rect x="74" y="92" width="94" height="12" fill="#e8d9a8" stroke="${l}" stroke-width="3"/><path d="M121 52 q10 -24 34 -22" fill="none" stroke="#444" stroke-width="4"/>`+Rt(160,28,14)+Z(200,90,1.7)+E(200,126,"\\u22123",26,"#d6362b")+`<path d="M180 52 l8 8 M200 46 v10 M220 52 l-8 8" stroke="${l}" stroke-width="3" stroke-linecap="round"/>`,barrel:()=>y(...ae)+`<path d="M60 36 Q50 88 60 140 H130 Q140 88 130 36Z" fill="#a8703a" stroke="${l}" stroke-width="4"/><path d="M56 56 H134 M52 88 H138 M56 120 H134" stroke="#4b4b4b" stroke-width="7"/>`+B(180,60,40,56,6,"#fbf6e8",Z(0,0,1.8))+T(142,88,156,74,"#444",3)+`<circle cx="210" cy="116" r="17" fill="#3aa655" stroke="${l}" stroke-width="3"/><path d="M201 116 L208 123 L220 108" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,appaloosa:()=>y(...G)+M(40,80,22,O(40,80,22,"#5a7aa0"))+M(200,80,22)+T(66,80,100,80,"#2f8f3a",5)+T(174,80,140,80,"#2f8f3a",5)+E(120,98,"\\u22121",34,"#1f6b2a")+`<g transform="translate(110 30)"><rect x="0" y="-5" width="40" height="12" rx="4" fill="#8a6a3a" stroke="${l}" stroke-width="3"/><rect x="-6" y="-8" width="10" height="18" rx="3" fill="#c9b48e" stroke="${l}" stroke-width="3"/></g><path d="M40 128 H200" stroke="${l}" stroke-width="3" stroke-dasharray="4 6"/>`,mustang:()=>y(...G)+M(40,80,22,O(40,80,22,"#5a7aa0"))+M(200,80,22)+T(100,80,66,80,"#d6362b",5)+T(140,80,174,80,"#d6362b",5)+E(120,98,"+1",34,"#d6362b")+`<path d="M104 36 q-8 -16 6 -22 q10 8 6 22 q10 -6 16 4 q-6 10 -14 6 q-12 6 -14 -10z" fill="#c8a06a" stroke="${l}" stroke-width="3"/><path d="M40 128 H200" stroke="${l}" stroke-width="3" stroke-dasharray="4 6"/>`,colt:()=>y(...G)+it(1,22),schofield:()=>y(...G)+it(2,26),remington:()=>y(...G)+it(3,34),carabine:()=>y(...G)+it(4,44),winchester:()=>y(...G)+it(5,58),volcanic:()=>y(...G)+it(1,26,E(176,50,"\\u221E",40,"#d6362b")+Rt(150,36,10))},se=t=>"data:image/svg+xml,"+encodeURIComponent(t).replace(/\'/g,"%27").replace(/\\(/g,"%28").replace(/\\)/g,"%29"),ie=(t,e=240,a=156)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${a}">${t}</svg>`,Ze=t=>yt[t]?ie(yt[t]()):"",oe=t=>yt[t]?se(Ze(t)):"",Tt={bartcassidy:{bg:"#f2a65a",hat:"wide",hatColor:"#8b5a2b",band:"#d6362b",extras:["bandana"]},blackjack:{bg:"#2f6f4f",hat:"top",hatColor:"#222",band:"#d6362b",extras:["mustache","spade"]},calamityjanet:{bg:"#f4d35e",hat:"wide",hatColor:"#c58b3a",band:"#8b3a2b",extras:["braid"]},elgringo:{bg:"#6fa8dc",hat:"bowler",hatColor:"#3b4a6b",extras:["mustache"]},jessejones:{bg:"#9aa86a",hat:"wide",hatColor:"#5b6b3a",band:"#222",extras:["stubble"]},jourdonnais:{bg:"#5fb3b3",hat:"cap",hatColor:"#3a6ea5",extras:["mustache"]},kitcarlson:{bg:"#b08ad8",hat:"wide",hatColor:"#5a3d7a",extras:["star"]},luckyduke:{bg:"#7bc67b",hat:"top",hatColor:"#1f7a3a",extras:["clover"]},paulregret:{bg:"#f28f6b",hat:"sombrero",hatColor:"#d9a441",band:"#d6362b",extras:["mustache"]},pedroramirez:{bg:"#d9534f",hat:"cap",hatColor:"#7a2a2a",extras:["mustache","bandana"]},rosedoolan:{bg:"#f7c6d9",hat:"bonnet",hatColor:"#e58fb0",extras:["rose","braid"]},sidketchum:{bg:"#aab4bd",hat:"visor",hatColor:"#4c5560",extras:["glasses"]},slabthekiller:{bg:"#8b1e1e",hat:"wide",hatColor:"#151515",extras:["scar"]},suzylafayette:{bg:"#c9a6e8",hat:"bonnet",hatColor:"#8a5fb5",extras:["feather","braid"]},vulturesam:{bg:"#c2a878",hat:"wide",hatColor:"#6b4a2b",extras:["stubble","vulture"]},willythekid:{bg:"#bfe3f7",hat:"cap",hatColor:"#3a8fd9",extras:["freckles"]}},x=`stroke="${l}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;function Be(t,e,a){let r=a?(n,s)=>`<rect x="${120-s/2}" y="${n}" width="${s}" height="12" fill="${a}" stroke="${l}" stroke-width="4"/>`:()=>"";switch(t){case"wide":return`<ellipse cx="120" cy="66" rx="104" ry="20" fill="${e}" ${x}/><path d="M66 64 Q64 14 120 12 Q176 14 174 64Z" fill="${e}" ${x}/>${r(46,106)}`;case"top":return`<ellipse cx="120" cy="62" rx="74" ry="14" fill="${e}" ${x}/><rect x="82" y="-6" width="76" height="66" rx="8" fill="${e}" ${x}/>${r(40,76)}`;case"bowler":return`<ellipse cx="120" cy="62" rx="82" ry="14" fill="${e}" ${x}/><path d="M70 60 Q70 6 120 6 Q170 6 170 60Z" fill="${e}" ${x}/>`;case"sombrero":return`<ellipse cx="120" cy="68" rx="114" ry="22" fill="${e}" ${x}/><path d="M92 66 Q104 -2 120 -6 Q136 -2 148 66Z" fill="${e}" ${x}/>${r(48,56)}`;case"cap":return`<path d="M52 66 Q56 14 120 12 Q184 14 188 66Z" fill="${e}" ${x}/><path d="M60 66 H208 Q216 66 206 76 H70Z" fill="${e}" ${x}/>`;case"bonnet":return`<path d="M44 92 Q36 10 120 8 Q204 10 196 92 Q170 56 120 56 Q70 56 44 92Z" fill="${e}" ${x}/>`;case"visor":return`<path d="M62 58 H178 V66 H62Z" fill="${e}" ${x}/><path d="M58 66 H182 Q190 78 176 80 H64 Q50 78 58 66Z" fill="${e}" ${x}/>`}}function Qt(t){switch(t){case"bandana":return`<path d="M58 196 Q120 214 182 196 L120 244 Z" fill="#d6362b" ${x}/><circle cx="120" cy="212" r="3.5" fill="#fff"/><circle cx="102" cy="206" r="3" fill="#fff"/><circle cx="138" cy="206" r="3" fill="#fff"/>`;case"mustache":return`<path d="M82 156 Q100 136 120 152 Q140 136 158 156 Q140 166 120 158 Q100 166 82 156Z" fill="${l}"/>`;case"braid":return[48,192].map(e=>`<path d="M${e} 118 q${e<120?-14:14} 34 0 70" fill="none" stroke="#b5651d" stroke-width="16" stroke-linecap="round"/><path d="M${e} 118 q${e<120?-14:14} 34 0 70" fill="none" stroke="${l}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`).join("");case"stubble":return Array.from({length:16},(e,a)=>`<circle cx="${84+a%8*10}" cy="${160+Math.floor(a/8)*12+a%2*3}" r="2.2" fill="${l}"/>`).join("");case"star":return`<g transform="translate(120 206)"><polygon points="0,-20 6,-6 20,-6 9,3 13,18 0,9 -13,18 -9,3 -20,-6 -6,-6" fill="#ffd23f" ${x.replace("6","4")}/></g>`;case"spade":return`<path d="M120 30 q-22 22 -14 34 q8 8 14 -2 q6 10 14 2 q8 -12 -14 -34z" fill="#fff" stroke="${l}" stroke-width="2.5"/>`;case"clover":return[[-9,-9],[9,-9],[-9,9],[9,9]].map(([e,a])=>`<circle cx="${120+e}" cy="${26+a}" r="9" fill="#9be07a" stroke="${l}" stroke-width="3"/>`).join("");case"rose":return`<g transform="translate(168 34)"><circle r="14" fill="#d6362b" ${x.replace("6","4")}/><path d="M-5 -2 q5 -8 10 0 q-4 8 -10 0" fill="none" stroke="${l}" stroke-width="3"/></g>`;case"glasses":return`<circle cx="86" cy="107" r="26" fill="none" ${x.replace("6","5")}/><circle cx="152" cy="104" r="28" fill="none" ${x.replace("6","5")}/><path d="M112 106 h12" stroke="${l}" stroke-width="5"/>`;case"scar":return\'<path d="M156 118 L100 176" stroke="#b02a2a" stroke-width="7" stroke-linecap="round"/><path d="M142 132 l12 6 M128 146 l12 6 M114 160 l12 6" stroke="#b02a2a" stroke-width="4"/>\';case"freckles":return[[84,144],[98,150],[112,144],[136,144],[150,150],[164,144]].map(([e,a])=>`<circle cx="${e}" cy="${a}" r="3.4" fill="#b5651d"/>`).join("");case"feather":return`<path d="M170 40 Q214 -2 232 14 Q204 22 190 56 Z" fill="#fff" ${x.replace("6","4")}/><path d="M176 48 Q206 20 226 16" fill="none" stroke="${l}" stroke-width="3"/>`;case"vulture":return\'<g transform="translate(120 28)"><path d="M-30 6 Q-14 -18 0 -2 Q14 -18 30 6 Q14 0 0 12 Q-14 0 -30 6Z" fill="#222" stroke="#fff" stroke-width="2.5"/><path d="M0 -2 l6 8 l-6 2z" fill="#e8b830"/></g>\'}return""}function Je(t){let e=Tt[t];if(!e)return"";let a=`<ellipse cx="90" cy="106" rx="14" ry="17" fill="${l}"/><ellipse cx="150" cy="102" rx="17" ry="21" fill="${l}"/>`,r=["wide","sombrero","bonnet"].includes(e.hat),n=e.extras.filter(o=>o==="braid"),s=`<path d="M30 240 Q40 196 120 190 Q200 196 210 240Z" fill="${e.hatColor}" opacity=".85" ${x}/>`;return ie(`<rect width="240" height="240" fill="${e.bg}"/>${s}${n.map(Qt).join("")}\n    <circle cx="120" cy="125" r="80" fill="#fff" ${x.replace("6","8")}/>${a}\n    ${e.extras.filter(o=>o!=="braid"&&o!=="star").map(Qt).join("")}\n    ${e.extras.includes("star")?Qt("star"):""}\n    ${Be(e.hat,e.hatColor,e.band)}`,240,240).replace(/<g transform="translate\\(120 28\\)">/,\'<g transform="translate(120 34)">\')}var le=t=>Tt[t]?se(Je(t)):"",ha=Object.keys(yt),pa=Object.keys(Tt);var w="me",ge=t=>document.getElementById(t),We=t=>new Promise(e=>setTimeout(e,t)),K=t=>t.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;"})[e]),be={sheriff:"\\uBCF4\\uC548\\uAD00",deputy:"\\uBD80\\uBCF4\\uC548\\uAD00",outlaw:"\\uBB34\\uBC95\\uC790",renegade:"\\uBC30\\uC2E0\\uC790"};var $e={bang:"\\uC0AC\\uAC70\\uB9AC \\uC548\\uC758 \\uD55C \\uBA85\\uC5D0\\uAC8C \\uACF5\\uACA9\\uD569\\uB2C8\\uB2E4. \\uD134\\uC5D0 1\\uBC88.",missed:"\\uACF5\\uACA9\\uC744 \\uD53C\\uD569\\uB2C8\\uB2E4.",beer:"\\uC0DD\\uBA85\\uB825 1\\uC744 \\uD68C\\uBCF5\\uD569\\uB2C8\\uB2E4.",panic:"\\uAC70\\uB9AC 1 \\uC774\\uB0B4 \\uD55C \\uBA85\\uC758 \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uAC00\\uC838\\uC635\\uB2C8\\uB2E4.",catbalou:"\\uC544\\uBB34\\uC5D0\\uAC8C\\uC11C \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uBC84\\uB9AC\\uAC8C \\uD569\\uB2C8\\uB2E4.",stagecoach:"\\uCE74\\uB4DC 2\\uC7A5\\uC744 \\uBF51\\uC2B5\\uB2C8\\uB2E4.",wellsfargo:"\\uCE74\\uB4DC 3\\uC7A5\\uC744 \\uBF51\\uC2B5\\uB2C8\\uB2E4.",generalstore:"\\uC778\\uC6D0\\uB9CC\\uD07C \\uCE74\\uB4DC\\uB97C \\uD3BC\\uCE5C \\uB2E4\\uC74C, \\uC774 \\uCE74\\uB4DC\\uB97C \\uC0AC\\uC6A9\\uD55C \\uC0AC\\uB78C\\uBD80\\uD130 \\uC2DC\\uACC4\\uBC29\\uD5A5\\uC73C\\uB85C \\uC6D0\\uD558\\uB294 \\uCE74\\uB4DC\\uB97C \\uD55C \\uC7A5\\uC529 \\uAC00\\uC838\\uAC11\\uB2C8\\uB2E4.",gatling:"\\uB2E4\\uB978 \\uBAA8\\uB4E0 \\uC0AC\\uB78C\\uC5D0\\uAC8C \\uBC45!\\uC744 \\uC3E9\\uB2C8\\uB2E4.",indians:"\\uB2E4\\uB978 \\uBAA8\\uB4E0 \\uC0AC\\uB78C\\uB4E4\\uC774 <\\uBC45!> \\uD55C \\uC7A5\\uC744 \\uBC84\\uB9B4 \\uC218 \\uC788\\uC73C\\uBA70, \\uADF8\\uB7EC\\uC9C0 \\uC54A\\uC73C\\uBA74 \\uC0DD\\uBA85\\uB825 1\\uC744 \\uC783\\uC2B5\\uB2C8\\uB2E4.",duel:"\\uD45C\\uC801\\uC774 \\uB41C \\uC0AC\\uB78C\\uACFC \\uACB0\\uD22C\\uB97C \\uC2E0\\uCCAD\\uD55C \\uC0AC\\uB78C\\uC774 \\uBC88\\uAC08\\uC544 <\\uBC45!>\\uC744 \\uB0C5\\uB2C8\\uB2E4. \\uBA3C\\uC800 <\\uBC45!>\\uC744 \\uB0BC \\uC218 \\uC5C6\\uAC8C \\uB41C \\uC0AC\\uB78C\\uC774 \\uC0DD\\uBA85\\uB825 1\\uC744 \\uC783\\uC2B5\\uB2C8\\uB2E4.",saloon:"\\uBAA8\\uB4E0 \\uD50C\\uB808\\uC774\\uC5B4\\uAC00 \\uC0DD\\uBA85\\uB825 1\\uC744 \\uD68C\\uBCF5\\uD569\\uB2C8\\uB2E4.",jail:"\\uCC28\\uB840\\uB97C \\uC2DC\\uC791\\uD558\\uAE30 \\uC804\\uC5D0 \\uCE74\\uB4DC\\uB97C \\uD3BC\\uCCD0, \\uCC28\\uB840\\uB97C \\uC815\\uC0C1\\uC801\\uC73C\\uB85C \\uC9C4\\uD589\\uD560 \\uAC83\\uC778\\uC9C0 \\uAC74\\uB108\\uB6F8 \\uAC83\\uC778\\uC9C0\\uB97C \\uACB0\\uC815\\uD569\\uB2C8\\uB2E4. \\u2665 = \\uC815\\uC0C1 \\uC9C4\\uD589",dynamite:"\\uCC28\\uB840\\uB97C \\uC2DC\\uC791\\uD558\\uAE30 \\uC804\\uC5D0 \\uCE74\\uB4DC\\uB97C \\uD3BC\\uCCD0, \\uC0DD\\uBA85\\uB825 3\\uC744 \\uC783\\uC744 \\uAC83\\uC778\\uC9C0 \\uC774 \\uCE74\\uB4DC\\uB97C \\uC67C\\uCABD \\uC0AC\\uB78C\\uC5D0\\uAC8C \\uB118\\uAE38 \\uAC83\\uC778\\uC9C0\\uB97C \\uACB0\\uC815\\uD569\\uB2C8\\uB2E4. \\u26602~9 = \\uD3ED\\uBC1C",barrel:"\\uACF5\\uACA9\\uC744 \\uBC1B\\uC744 \\uB54C \\uCE74\\uB4DC\\uB97C \\uD3BC\\uCCD0 \\u2665\\uC774\\uBA74 \\uBE57\\uB098\\uAC10!\\uC73C\\uB85C \\uCE69\\uB2C8\\uB2E4.",appaloosa:"\\uB2E4\\uB978 \\uC0AC\\uB78C\\uC744 \\uBCFC \\uB54C \\uAC70\\uB9AC 1\\uC774 \\uAC00\\uAE4C\\uC6CC\\uC9D1\\uB2C8\\uB2E4.",mustang:"\\uB2E4\\uB978 \\uC0AC\\uB78C\\uC774 \\uBCFC \\uB54C \\uAC70\\uB9AC 1\\uC774 \\uBA40\\uC5B4\\uC9D1\\uB2C8\\uB2E4.",schofield:"\\uC0AC\\uAC70\\uB9AC 2",remington:"\\uC0AC\\uAC70\\uB9AC 3",carabine:"\\uC0AC\\uAC70\\uB9AC 4",winchester:"\\uC0AC\\uAC70\\uB9AC 5",volcanic:"\\uC0AC\\uAC70\\uB9AC 1. <\\uBC45!>\\uC744 \\uC6D0\\uD558\\uB294 \\uB9CC\\uD07C \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4."},Ge={S:"\\u2660",H:"\\u2665",D:"\\u2666",C:"\\u2663"},Ue={11:"J",12:"Q",13:"K",14:"A"},Ve=["bang","panic","catbalou","duel","jail"],tt=window.__IMG??{},vt=t=>tt.cards?.[t]??oe(t),Ct=t=>tt.chars?.[t]??le(t),de=(t,e="sm")=>Ct(t)?`<img class="av ${e}" src="${Ct(t)}" alt="">`:"",P=null,p=null,j=null,k=null,H=null,C=null,jt=5,Dt=!1,ce;function Kt(){let t=[{id:w,name:"\\uB098"},...Array.from({length:jt-1},(e,a)=>({id:`bot${a+1}`,name:`\\uBD07${a+1}`}))];P=Gt(t),j=null,k=null,H=null,C=null,Ot(),me()}function Ot(){p=P?te(P,w):null,v()}async function me(){if(!Dt){Dt=!0;try{for(;P&&!P.winner;){let t=rt(P);if(t===w||!t)break;let e=P.players.find(a=>a.id===w);await We(window.__fast?3:e.alive?750:120),ee(P,t),Ot()}}finally{Dt=!1}}}function D(t){if($){if(!$.ws||$.ws.readyState!==1){I("\\uC5F0\\uACB0 \\uC911\\uC785\\uB2C8\\uB2E4. \\uC7A0\\uC2DC\\uB9CC\\uC694\\u2026");return}$.ws.send(JSON.stringify({type:"action",action:t})),j=null,k=null,H=null,C=null,v();return}if(P)try{ht(P,w,t),j=null,k=null,H=null,C=null,Ot(),me()}catch(e){H=null,C=null,v(),e instanceof X?I(e.message):(console.error(e),I("\\uC624\\uB958\\uAC00 \\uBC1C\\uC0DD\\uD588\\uC2B5\\uB2C8\\uB2E4"))}}var ue=!!window.__SERVED,$=null,et={name:"",room:new URLSearchParams(location.search).get("room")?.toUpperCase().slice(0,8)??""},St={get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}}};et.name=St.get("bang.name")??"";var Ye=()=>Array.from({length:4},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random()*24)]).join("");function Xe(t,e){St.set("bang.name",e),P=null,p=null,j=null,k=null,H=null,C=null,$={ws:null,room:t,name:e,token:St.get("bang.tok."+t),host:null,lobby:null,closing:!1,joined:!1,tries:0},_t(),v()}function _t(){let t=$;if(t.ws&&t.ws.readyState<=1)return;let e;try{e=new WebSocket(`${location.protocol==="https:"?"wss":"ws"}://${location.host}`)}catch{I("\\uC11C\\uBC84\\uC5D0 \\uC5F0\\uACB0\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4"),Mt();return}t.ws=e,e.onopen=()=>{t.tries=0,e.send(JSON.stringify({type:"join",room:t.room,name:t.name,token:t.token??void 0}))},e.onmessage=a=>{try{ta(t,JSON.parse(String(a.data)))}catch(r){console.error(r)}},e.onclose=()=>{$!==t||t.closing||(t.ws=null,t.tries++,t.tries>1&&I("\\uC5F0\\uACB0\\uC774 \\uB04A\\uACBC\\uC5B4\\uC694. \\uB2E4\\uC2DC \\uC5F0\\uACB0 \\uC911\\u2026"),setTimeout(()=>{$===t&&!t.closing&&_t()},Math.min(800*t.tries,5e3)))}}function ta(t,e){if(e.type==="joined"){w=e.you,t.token=e.token,t.joined=!0,St.set("bang.tok."+t.room,e.token);return}if(e.type==="lobby"){t.lobby=e,t.host=e.host,p=null,j=null,k=null,H=null,C=null,v();return}if(e.type==="state"){let a=p?.actor===w;if(t.host=e.host,t.lobby=null,p=e.view,p.actor!==w&&(H=null,k=null),!a&&p.actor===w&&!p.winner)try{navigator.vibrate?.(60)}catch{}v();return}if(e.type==="error"){if(!t.joined){I(e.message),Mt();return}H=null,C=null,v(),I(e.message)}}function Mt(){if($){$.closing=!0;try{$.ws?.close()}catch{}}$=null,p=null,w="me",j=null,k=null,H=null,C=null,v()}var wt=t=>{$?.ws?.readyState===1?$.ws.send(JSON.stringify(t)):I("\\uC5F0\\uACB0 \\uC911\\uC785\\uB2C8\\uB2E4. \\uC7A0\\uC2DC\\uB9CC\\uC694\\u2026")};document.addEventListener("visibilitychange",()=>{!document.hidden&&$&&!$.closing&&_t()});document.addEventListener("input",t=>{let e=t.target;e.id==="f-name"?et.name=e.value:e.id==="f-room"&&(et.room=e.value.toUpperCase())});function ea(){let t=$,e=t.lobby;if(!e)return\'<main class="menu"><p class="sub" role="status">\\uC11C\\uBC84\\uC5D0 \\uC5F0\\uACB0\\uD558\\uB294 \\uC911\\u2026</p><button class="btn ghost" data-act="leave">\\uCDE8\\uC18C</button></main>\';let a=e.host===w,r=e.players;return`<main class="menu lobby">\n    <div class="poster"><p class="eyebrow">\\uBC29 \\uCF54\\uB4DC</p><h1 class="code">${K(e.room)}</h1><p class="sub">\\uCE5C\\uAD6C\\uC5D0\\uAC8C \\uCF54\\uB4DC\\uB098 \\uB9C1\\uD06C\\uB97C \\uC54C\\uB824 \\uC8FC\\uC138\\uC694</p></div>\n    <button class="btn" data-act="copy">\\uCD08\\uB300 \\uB9C1\\uD06C \\uBCF5\\uC0AC</button>\n    <ul class="plist" aria-label="\\uCC38\\uAC00\\uC790">${r.map(n=>`<li class="${n.online?"":"off"}"><b>${K(n.name)}</b>${n.id===e.host?\' <span class="role sheriff">\\uBC29\\uC7A5</span>\':""}${n.id===w?\' <span class="role">\\uB098</span>\':""}${n.bot?\' <span class="role">\\uBD07</span>\':""}</li>`).join("")}</ul>\n    ${a?`<div class="bar"><button class="btn" data-act="addbot" ${r.length>=7?"disabled":""}>\\uBD07 \\uCD94\\uAC00</button><button class="btn" data-act="rmbot" ${r.some(n=>n.bot)?"":"disabled"}>\\uBD07 \\uBE7C\\uAE30</button></div>\n      <button class="btn primary big" data-act="netstart" ${r.length>=4?"":"disabled"}>${r.length>=4?`\\uC2DC\\uC791 (${r.length}\\uBA85)`:`4\\uBA85\\uBD80\\uD130 \\uC2DC\\uC791 (${r.length}/4)`}</button>`:`<p class="sub" role="status">\\uBC29\\uC7A5\\uC774 \\uC2DC\\uC791\\uD558\\uAE38 \\uAE30\\uB2E4\\uB9AC\\uB294 \\uC911\\u2026 (${r.length}\\uBA85)</p>`}\n    <button class="btn ghost" data-act="leave">\\uB098\\uAC00\\uAE30</button></main>`}function I(t){let e=ge("toast");e.textContent=t,e.classList.add("show"),clearTimeout(ce),ce=setTimeout(()=>e.classList.remove("show"),2200)}var pt=t=>p.players.find(e=>e.id===t),_=t=>t?pt(t)?.name??"?":"\\uC5C6\\uC74C",fe=(t,e)=>t.table.some(a=>a.kind===e);function aa(t,e){let a=p.players.filter(u=>u.alive),r=a.findIndex(u=>u.id===t.id),n=a.findIndex(u=>u.id===e.id),s=Math.abs(r-n),o=Math.min(s,a.length-s);o+=(fe(e,"mustang")?1:0)+(e.character==="paulregret"?1:0),o-=(fe(t,"appaloosa")?1:0)+(t.character==="rosedoolan"?1:0);let d=1;for(let u of t.table){let g=F[u.kind];g&&(d=g)}return{dist:Math.max(1,o),range:d}}var na=["barrel","appaloosa","mustang","jail","dynamite"],he=t=>{let e=Math.max(0,t.hp);return`<span class="bullets" role="img" aria-label="\\uC0DD\\uBA85\\uB825 ${e}/${t.maxHp}">${Array.from({length:t.maxHp},(a,r)=>`<svg class="bl ${r<e?"on":""}" viewBox="0 0 10 26"><path d="M1 25V10Q1 2 5 1Q9 2 9 10V25Z"/><path class="rim" d="M1 21H9"/></svg>`).join("")}</span>`};function Lt(t,e){let a=p.turn===t.id,r=p.actor===t.id,n="",s="";if(e==="opp"&&H&&t.alive){let A=J().hand.find(we=>we.id===H.cardId),U=aa(J(),t),Ht=A&&(A.kind==="bang"||A.kind==="missed"),ye=A?.kind==="panic",It=Ht?U.dist<=U.range:ye?U.dist<=1:null;n="target"+(It===!1?" far":""),s=`<span class="dist">\\uAC70\\uB9AC ${U.dist}${It===null?"":It?" \\u2713":" \\u2715"}</span>`}let o=t.table.find(A=>F[A.kind]),d=o?o.kind:"colt",u=o?F[o.kind]:1,g=na.map(A=>{let U=t.table.find(Ht=>Ht.kind===A);return`<span class="eq ${U?"on":""} ${U&&(A==="jail"||A==="dynamite")?"bad":""}" title="${Y[A]}"><span class="si" style="background-image:url(\'${vt(A)}\')"></span></span>`}).join(""),i=e==="sheet"?"div":"button",f=e==="opp"?`data-act="player" data-id="${t.id}"`:e==="me"?`data-act="info" data-id="${t.id}"`:"",m=`bd ${e==="sheet"?"inset":e} ${t.alive?"":"dead"} ${a?"turn":""} ${r?"act":""} ${n}`,b=`<span class="role ${t.role??"hidden"}">${t.role==="sheriff"?"\\u2605 ":""}${t.role?be[t.role]:"?"}</span>`,L=`<span class="hc"><b class="cardico"></b>${t.handCount??t.hand?.length??0}</span>`,dt=ke(t.character);return e==="sheet"?`<${i} class="${m}" ${f}>\n    <span class="bd-top"><span class="bd-name">${K(t.name)}</span>${b}\n      ${t.alive?he(t):\'<span class="gone">\\uD0C8\\uB77D</span>\'}${L}${s}</span>\n    <span class="bd-slots">\n      <span class="sl sl-ch" title="${V.find(A=>A.id===t.character).text}">${de(t.character,"lg")}<span class="n">${dt}</span></span>\n      <span class="sl sl-eq">${g}</span>\n      <span class="sl sl-wp"><span class="wpic" style="background-image:url(\'${vt(d)}\')"></span><span class="n">${o?Y[o.kind]:"\\uCF5C\\uD2B8 .45"}</span><i class="rg">${u}</i></span>\n    </span>\n  </${i}>`:`<${i} class="${m}" ${f}>\n    <span class="cav">${de(t.character,"lg")}</span>\n    <span class="l1"><span class="bd-name">${K(t.name)}</span>${b}${L}</span>\n    <span class="l2">${t.alive?he(t):\'<span class="gone">\\uD0C8\\uB77D</span>\'}<span class="wp" title="\\uBB34\\uAE30 \\uC0AC\\uAC70\\uB9AC ${u}"><b>${u}</b>${o?Y[o.kind]:"\\uCF5C\\uD2B8 .45"}</span></span>\n    <span class="l3">${g}</span>\n    <span class="l4"><span class="cn">${dt}</span>${s}</span>\n  </${i}>`}var q=t=>Y[t.kind],lt=t=>`${Ue[t.rank]??t.rank}${Ge[t.suit]}`,Nt=t=>t.suit==="H"||t.suit==="D",ke=t=>V.find(e=>e.id===t).name,J=()=>pt(w);function xt(t,e="",a=""){let r=vt(t.kind);return r?`<button class="card art ${Nt(t)?"red":""} ${e}" ${a}>\n    <span class="pic" style="background-image:url(\'${r}\')"></span>\n    <span class="corner">${lt(t)}</span>\n    <span class="nm">${q(t)}</span>\n  </button>`:`<button class="card ${Nt(t)?"red":""} ${e}" ${a}>\n    <span class="corner">${lt(t)}</span>\n    <span class="nm">${q(t)}</span>\n    <span class="ds">${$e[t.kind]}</span>\n  </button>`}function ra(){let t=p,e=t.frame,a=t.actor===w;if(t.winner)return{text:"\\uAC8C\\uC784 \\uC885\\uB8CC",mine:!1};if(!e)return a?{text:"\\uB0B4 \\uCC28\\uB840. \\uCE74\\uB4DC\\uB97C \\uB0B4\\uAC70\\uB098 \\uD134\\uC744 \\uB05D\\uB0B4\\uC138\\uC694.",mine:a}:{text:`${_(t.actor)}\\uC758 \\uCC28\\uB840`,mine:a};switch(e.t){case"bang":return{text:a?`${_(e.src)}\\uC758 \\uBC45! \\uACF5\\uACA9. \\uBE57\\uB098\\uAC10!\\uC744 \\uB0B4\\uAC70\\uB098 \\uB9DE\\uC73C\\uC138\\uC694${e.needed>1?` (${e.needed}\\uC7A5 \\uD544\\uC694)`:""}.`:`${_(e.tgt)}\\uC774(\\uAC00) \\uC751\\uB2F5 \\uC911`,mine:a};case"indians":return{text:a?"\\uC778\\uB514\\uC5B8! \\uBC45!\\uC744 \\uB0B4\\uC9C0 \\uBABB\\uD558\\uBA74 \\uC0DD\\uBA85 -1":`${_(e.tgt)}\\uC774(\\uAC00) \\uC751\\uB2F5 \\uC911`,mine:a};case"duel":return{text:a?`${_(e.src===w?e.tgt:e.src)}\\uC640 \\uACB0\\uD22C \\uC911. \\uBC45!\\uC744 \\uB0B4\\uC138\\uC694.`:`${_(e.cur)}\\uC758 \\uACB0\\uD22C \\uC751\\uC218 \\uCC28\\uB840`,mine:a};case"dying":return{text:a?"\\uC0DD\\uBA85\\uC774 0\\uC785\\uB2C8\\uB2E4! \\uB9E5\\uC8FC\\uB97C \\uC4F0\\uC138\\uC694.":`${_(e.tgt)}\\uC774(\\uAC00) \\uC4F0\\uB7EC\\uC9C0\\uB294 \\uC911`,mine:a};case"store":return{text:a?"\\uC7A1\\uD654\\uC810. \\uCE74\\uB4DC\\uB97C \\uD55C \\uC7A5 \\uACE0\\uB974\\uC138\\uC694.":`${_(t.actor)}\\uC774(\\uAC00) \\uC7A1\\uD654\\uC810\\uC5D0\\uC11C \\uACE0\\uB974\\uB294 \\uC911`,mine:a};case"kit":return{text:a?"\\uD0A4\\uD2B8 \\uCE7C\\uC2A8: \\uB371 \\uC704\\uB85C \\uB3CC\\uB824\\uB193\\uC744 \\uCE74\\uB4DC 1\\uC7A5 \\uC120\\uD0DD":`${_(e.pid)}\\uC774(\\uAC00) \\uACE0\\uB974\\uB294 \\uC911`,mine:a};case"jesse":return{text:a?"\\uC81C\\uC2DC \\uC874\\uC2A4: \\uCCAB \\uCE74\\uB4DC\\uB97C \\uBF51\\uC744 \\uACF3 \\uC120\\uD0DD":`${_(e.pid)}\\uC774(\\uAC00) \\uACE0\\uB974\\uB294 \\uC911`,mine:a};case"pedro":return{text:a?"\\uD398\\uB4DC\\uB85C: \\uCCAB \\uCE74\\uB4DC\\uB97C \\uBF51\\uC744 \\uACF3 \\uC120\\uD0DD":`${_(e.pid)}\\uC774(\\uAC00) \\uACE0\\uB974\\uB294 \\uC911`,mine:a};default:return{text:"\\uC9C4\\uD589 \\uC911",mine:a}}}function ot(){let t=J().hand??[];return t.length?`<div class="mh"><span class="mh-t">\\uB0B4 \\uD328 ${t.length}\\uC7A5</span><div class="mh-r">${t.map(e=>`<span class="mc ${Nt(e)?"red":""}" title="${q(e)}"><span class="mp" style="background-image:url(\'${vt(e.kind)}\')"></span><span class="mn">${q(e)}</span><span class="mf">${lt(e)}</span></span>`).join("")}</div></div>`:""}function pe(){let t=p.frame,e=p.actor===w;if(C?.kind==="info"){let a=pt(C.pid),r=V.find(n=>n.id===a.character);return`<div class="sheet"><div class="grab"></div>${ot()}\n      ${Ct(a.character)?`<img class="av lg" src="${Ct(a.character)}" alt="">`:""}<h3>${K(a.name)} \\xB7 ${r.name} <small>\\uCD5C\\uB300 \\uC0DD\\uBA85 ${r.hp}${a.role==="sheriff"?" +1":""}</small></h3>\n      <p>${r.text}</p>\n      <h4>${K(a.name)}\\uC758 \\uD310</h4>${Lt(a,"sheet")}\n      ${a.table.length?`<h4>\\uC7A5\\uCC29 \\uC911</h4><div class="row">${a.table.map(n=>xt(n,"sm")).join("")}</div>`:""}\n      <button class="btn" data-act="closeSheet">\\uB2EB\\uAE30</button></div>`}if(C?.kind==="zone"){let a=pt(C.pid),n=J().hand.find(s=>s.id===C.cardId)?.kind==="panic"?"\\uAC00\\uC838\\uC62C":"\\uBC84\\uB9AC\\uAC8C \\uD560";return`<div class="sheet"><div class="grab"></div>${ot()}<h3>${K(a.name)}\\uC758 \\uC5B4\\uB5A4 \\uCE74\\uB4DC\\uB97C ${n}\\uAE4C\\uC694?</h3>\n      <div class="col">\n      ${a.handCount?`<button class="btn wide" data-act="zone" data-zone="hand">\\uC190\\uD328 1\\uC7A5 (\\uBB34\\uC791\\uC704, ${a.handCount}\\uC7A5 \\uC911)</button>`:""}\n      ${a.table.map(s=>`<button class="btn wide" data-act="zone" data-zone="table" data-card="${s.id}">${q(s)} ${lt(s)}</button>`).join("")}\n      </div><button class="btn ghost" data-act="closeSheet">\\uCDE8\\uC18C</button></div>`}return!t||!e?"":t.t==="store"?`<div class="sheet"><div class="grab"></div>${ot()}<h3>\\uC7A1\\uD654\\uC810</h3><p>\\uD55C \\uC7A5\\uC744 \\uACE0\\uB974\\uC138\\uC694.</p>\n    <div class="row">${t.cards.map(a=>xt(a,"sm",`data-act="pick" data-card="${a.id}"`)).join("")}</div></div>`:t.t==="kit"?`<div class="sheet"><div class="grab"></div>${ot()}<h3>\\uD0A4\\uD2B8 \\uCE7C\\uC2A8</h3><p>\\uB371 \\uC704\\uB85C \\uB3CC\\uB824\\uB193\\uC744 \\uCE74\\uB4DC 1\\uC7A5\\uC744 \\uACE0\\uB974\\uC138\\uC694. \\uB098\\uBA38\\uC9C0 2\\uC7A5\\uC740 \\uC190\\uC73C\\uB85C \\uAC11\\uB2C8\\uB2E4.</p>\n    <div class="row">${t.cards.map(a=>xt(a,"sm",`data-act="kit" data-card="${a.id}"`)).join("")}</div></div>`:t.t==="jesse"?`<div class="sheet"><div class="grab"></div>${ot()}<h3>\\uC81C\\uC2DC \\uC874\\uC2A4</h3><p>\\uCCAB \\uBC88\\uC9F8 \\uCE74\\uB4DC\\uB97C \\uC5B4\\uB514\\uC11C \\uBF51\\uC744\\uAE4C\\uC694? \\uB450 \\uBC88\\uC9F8\\uB294 \\uB371\\uC5D0\\uC11C \\uBF51\\uC2B5\\uB2C8\\uB2E4.</p><div class="col">\n    <button class="btn wide" data-act="jesse" data-from="deck">\\uB371\\uC5D0\\uC11C 2\\uC7A5</button>\n    ${p.players.filter(a=>a.alive&&a.id!==w&&a.handCount>0).map(a=>`<button class="btn wide" data-act="jesse" data-from="${a.id}">${K(a.name)}\\uC758 \\uC190\\uD328\\uC5D0\\uC11C 1\\uC7A5 (${a.handCount}\\uC7A5)</button>`).join("")}\n    </div></div>`:t.t==="pedro"?`<div class="sheet"><div class="grab"></div>${ot()}<h3>\\uD398\\uB4DC\\uB85C \\uB77C\\uBBF8\\uB808\\uC2A4</h3><p>\\uCCAB \\uBC88\\uC9F8 \\uCE74\\uB4DC\\uB97C \\uC5B4\\uB514\\uC11C \\uBF51\\uC744\\uAE4C\\uC694?</p><div class="col">\n    <button class="btn wide" data-act="pedro" data-from="discard">\\uBC84\\uB9B0 \\uB354\\uBBF8 \\uB9E8 \\uC704: ${p.discardTop?`${q(p.discardTop)} ${lt(p.discardTop)}`:"\\uC5C6\\uC74C"}</button>\n    <button class="btn wide" data-act="pedro" data-from="deck">\\uB371\\uC5D0\\uC11C 2\\uC7A5</button></div></div>`:""}function sa(){let t=p,e=t.frame,a=J();if(t.winner||!a.alive||t.actor!==w)return"";let r=a.hand.find(o=>o.id===j),n=[],s=a.character==="sidketchum"&&a.hp<a.maxHp&&a.hand.length>=2&&(!e||["dying","bang","indians","duel"].includes(e.t));return k?(n.push(`<button class="btn primary" data-act="sidgo" ${k.length===2?"":"disabled"}>${k.length}/2 \\uC120\\uD0DD \\xB7 \\uC0DD\\uBA85 +1</button>`),n.push(\'<button class="btn ghost" data-act="sidcancel">\\uCDE8\\uC18C</button>\'),n.join("")):H?\'<button class="btn ghost" data-act="untarget">\\uB300\\uC0C1 \\uC120\\uD0DD \\uCDE8\\uC18C</button>\':(e?e.t==="bang"||e.t==="indians"||e.t==="duel"?(n.push(`<button class="btn primary" data-act="respond" ${r?"":"disabled"}>${r?`${q(r)} \\uB0B4\\uAE30`:"\\uB0BC \\uCE74\\uB4DC\\uB97C \\uC120\\uD0DD"}</button>`),n.push(`<button class="btn danger" data-act="decline">${e.t==="duel"?"\\uD3EC\\uAE30\\uD558\\uACE0 \\uB9DE\\uAE30":"\\uB9DE\\uAE30"}</button>`)):e.t==="dying"&&(n.push(`<button class="btn primary" data-act="play" ${r?.kind==="beer"?"":"disabled"}>\\uB9E5\\uC8FC \\uC0AC\\uC6A9</button>`),n.push(\'<button class="btn danger" data-act="decline">\\uD3EC\\uAE30</button>\')):(n.push(`<button class="btn primary" data-act="play" ${r?"":"disabled"}>${r?`${q(r)} \\uC0AC\\uC6A9`:"\\uCE74\\uB4DC\\uB97C \\uC120\\uD0DD"}</button>`),a.hand.length>a.hp?n.push(`<button class="btn" data-act="discard" ${r?"":"disabled"}>\\uBC84\\uB9AC\\uAE30 (${a.hand.length-a.hp}\\uC7A5 \\uCD08\\uACFC)</button>`):n.push(\'<button class="btn" data-act="end">\\uD134 \\uC885\\uB8CC</button>\')),s&&n.push(\'<button class="btn" data-act="sid">\\uC2DC\\uB4DC \\uB2A5\\uB825</button>\'),n.join(""))}function v(){let t=ge("app"),e=document.getElementById("hand")?.scrollLeft??0;if(!p){t.innerHTML=$?ea():ia();return}let a=J(),r=ra(),n=p.log.slice(-40),s=a.hand??[],o=p.winner,d=o&&(o==="sheriff"&&["sheriff","deputy"].includes(a.role)||o==="outlaws"&&a.role==="outlaw"||o==="renegade"&&a.role==="renegade"),u=s.find(b=>b.id===j),g=u&&!k?`<b>${q(u)}</b> ${$e[u.kind]}`:"",i=(()=>{let b=p.players.findIndex(L=>L.id===w);return[...p.players.slice(b+1),...p.players.slice(0,b)]})();t.innerHTML=`\n    <div class="frame" aria-hidden="true"></div>\n    <header class="hd"><div class="brand">\\uBC45!</div>\n      <div class="piles"><span>\\uB371 ${p.deckCount}</span><span>\\uBC84\\uB9BC ${p.discardTop?`${q(p.discardTop)} ${lt(p.discardTop)}`:"-"}</span></div>\n      <button class="mini" data-act="menu">\\uB098\\uAC00\\uAE30</button></header>\n    <section class="players n${i.length}" aria-label="\\uC0C1\\uB300 \\uD50C\\uB808\\uC774\\uC5B4">${i.map(b=>Lt(b,"opp")).join("")}</section>\n    <div class="info">\n      <div class="banner ${r.mine?"mine":""}" role="status">${r.text}</div>\n      ${g?`<div class="cdesc l">${g}</div>`:""}\n      <section class="log" id="log" aria-label="\\uC9C4\\uD589 \\uAE30\\uB85D">${n.map(b=>`<div>${K(b)}</div>`).join("")}</section>\n    </div>\n    <section class="me">\n      <div class="mypanel">\n        ${Lt(a,"me")}\n        ${g?`<div class="cdesc p">${g}</div>`:""}\n        <div class="bar">${sa()}</div>\n      </div>\n      <div class="hand" id="hand">${s.map(b=>{let L=j===b.id||(k?.includes(b.id)??!1);return xt(b,L?"sel":"",`data-act="card" data-id="${b.id}"`)}).join("")||\'<p class="empty">\\uC190\\uD328\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4</p>\'}</div>\n    </section>\n    ${pe()?`<div class="scrim" data-act="${C?"closeSheet":"noop"}"></div>${pe()}`:""}\n    ${o?`<div class="scrim dark"></div><div class="end"><h2>${o==="sheriff"?"\\uBCF4\\uC548\\uAD00 \\uD300 \\uC2B9\\uB9AC":o==="outlaws"?"\\uBB34\\uBC95\\uC790 \\uD300 \\uC2B9\\uB9AC":"\\uBC30\\uC2E0\\uC790 \\uC2B9\\uB9AC"}</h2>\n      <p class="${d?"win":"lose"}">${d?"\\uB2F9\\uC2E0\\uC758 \\uC2B9\\uB9AC\\uC785\\uB2C8\\uB2E4.":"\\uD328\\uBC30\\uD588\\uC2B5\\uB2C8\\uB2E4."}</p>\n      <ul>${p.players.map(b=>`<li><b>${K(b.name)}</b> ${ke(b.character)} \\xB7 ${be[b.role]}${b.alive?"":" (\\uD0C8\\uB77D)"}</li>`).join("")}</ul>\n      <button class="btn primary" data-act="again">\\uAC19\\uC740 \\uC778\\uC6D0\\uC73C\\uB85C \\uB2E4\\uC2DC</button><button class="btn" data-act="menu">\\uCC98\\uC74C\\uC73C\\uB85C</button></div>`:""}\n  `;let f=document.getElementById("hand");f&&(f.scrollLeft=e);let m=document.getElementById("log");m&&(m.scrollTop=m.scrollHeight)}function ia(){return`<main class="menu">\n    <div class="poster ${tt.title?"hasimg":""}" ${tt.title?`style="background-image:linear-gradient(rgba(20,12,6,.35),rgba(20,12,6,.75)),url(\'${tt.title}\')"`:""}><p class="eyebrow">\\uBCF4\\uB4DC\\uAC8C\\uC784 \\uC628\\uB77C\\uC778</p><h1>\\uBC45!</h1><p class="sub">\\uC11C\\uBD80\\uC758 \\uCD1D\\uC7A1\\uC774\\uB4E4. \\uC5ED\\uD560\\uC740 \\uC228\\uACA8\\uC838 \\uC788\\uACE0, \\uB204\\uAC00 \\uC544\\uAD70\\uC778\\uC9C0\\uB294 \\uC3F4 \\uBCF4\\uAE30 \\uC804\\uC5D4 \\uBAA8\\uB985\\uB2C8\\uB2E4.</p></div>\n    <div class="count" role="group" aria-label="\\uC778\\uC6D0"><p>\\uC778\\uC6D0 (\\uB098 + \\uBD07)</p>\n      <div>${[4,5,6,7].map(t=>`<button class="seg ${t===jt?"on":""}" data-act="count" data-n="${t}">${t}\\uBA85</button>`).join("")}</div></div>\n    <button class="btn primary big" data-act="start">\\uC5F0\\uC2B5 \\uC2DC\\uC791</button>\n    ${ue?`<div class="online"><p>\\uCE5C\\uAD6C\\uC640 \\uC628\\uB77C\\uC778\\uC73C\\uB85C</p>\n      <input id="f-name" maxlength="12" placeholder="\\uB0B4 \\uC774\\uB984" value="${K(et.name)}" autocomplete="nickname" enterkeyhint="next">\n      <input id="f-room" maxlength="8" placeholder="\\uBC29 \\uCF54\\uB4DC (\\uCE5C\\uAD6C \\uBC29\\uC5D0 \\uB4E4\\uC5B4\\uAC08 \\uB54C)" value="${K(et.room)}" autocapitalize="characters" autocomplete="off" enterkeyhint="go">\n      <div class="bar"><button class="btn primary" data-act="create">\\uC0C8 \\uBC29 \\uB9CC\\uB4E4\\uAE30</button><button class="btn" data-act="join">\\uCF54\\uB4DC\\uB85C \\uB4E4\\uC5B4\\uAC00\\uAE30</button></div></div>`:""}\n    <ul class="notes"><li>\\uAE30\\uBCF8\\uD310 \\uADDC\\uCE59 \\uADF8\\uB300\\uB85C: \\uCE74\\uB4DC 80\\uC7A5, \\uCE90\\uB9AD\\uD130 16\\uC885, \\uC5ED\\uD560 4\\uC885</li>\n      <li>\\uCE74\\uB4DC\\uB97C \\uD55C \\uBC88 \\uB204\\uB974\\uBA74 \\uC120\\uD0DD, \\uC544\\uB798 \\uBC84\\uD2BC\\uC73C\\uB85C \\uC0AC\\uC6A9</li>\n      ${ue?"<li>\\uC628\\uB77C\\uC778 \\uBC29\\uC740 \\uBD07\\uACFC \\uC11E\\uC5B4\\uC11C 4~7\\uBA85\\uAE4C\\uC9C0 \\uD560 \\uC218 \\uC788\\uC5B4\\uC694</li>":"<li>\\uCE5C\\uAD6C\\uC640 \\uD558\\uB294 \\uC628\\uB77C\\uC778 \\uB300\\uC804\\uC740 \\uC11C\\uBC84 \\uC8FC\\uC18C\\uB85C \\uC811\\uC18D\\uD558\\uBA74 \\uC5F4\\uB9BD\\uB2C8\\uB2E4</li>"}</ul></main>`}document.addEventListener("click",t=>{let e=t.target.closest("[data-act]");if(!e)return;let a=e.dataset.act,r=e.dataset;switch(a){case"count":jt=Number(r.n),v();return;case"start":Kt();return;case"again":$?$.host===w?wt({type:"reset"}):I("\\uBC29\\uC7A5\\uC774 \\uB2E4\\uC2DC \\uC2DC\\uC791\\uD574\\uC57C \\uD569\\uB2C8\\uB2E4"):Kt();return;case"menu":if($){Mt();return}P=null,p=null,v();return;case"leave":Mt();return;case"create":case"join":{let n=et.name.trim(),s=a==="create"?Ye():et.room.trim().toUpperCase();if(!n){I("\\uC774\\uB984\\uC744 \\uC785\\uB825\\uD558\\uC138\\uC694");return}if(!s){I("\\uBC29 \\uCF54\\uB4DC\\uB97C \\uC785\\uB825\\uD558\\uC138\\uC694");return}Xe(s,n);return}case"addbot":wt({type:"addBot"});return;case"rmbot":{let n=[...$?.lobby?.players??[]].reverse().find(s=>s.bot);n&&wt({type:"removeBot",id:n.id});return}case"netstart":wt({type:"start"});return;case"copy":{let n=`${location.origin}/?room=${$?.room??""}`;(async()=>{try{await navigator.clipboard.writeText(n),I("\\uCD08\\uB300 \\uB9C1\\uD06C\\uB97C \\uBCF5\\uC0AC\\uD588\\uC5B4\\uC694")}catch{try{navigator.share?await navigator.share({url:n,title:"\\uBC45! \\uCD08\\uB300"}):I(`\\uBC29 \\uCF54\\uB4DC: ${$?.room}`)}catch{I(`\\uBC29 \\uCF54\\uB4DC: ${$?.room}`)}}})();return}case"info":C={kind:"info",pid:r.id},v();return;case"closeSheet":C=null,v();return;case"untarget":H=null,v();return;case"player":{if(H){let n=r.id,s=J().hand.find(o=>o.id===H.cardId);if(!s||n===w||!pt(n).alive)return;if(s.kind==="panic"||s.kind==="catbalou"){C={kind:"zone",pid:n,cardId:s.id},v();return}D({type:"play",cardId:s.id,target:n})}else C={kind:"info",pid:r.id},v();return}case"zone":{let n=C,s=n.cardId;D({type:"play",cardId:s,target:n.pid,targetCard:r.zone==="hand"?{zone:"hand"}:{zone:"table",cardId:Number(r.card)}});return}case"card":{if(p.actor!==w){I("\\uC9C0\\uAE08\\uC740 \\uB0B4 \\uCC28\\uB840\\uAC00 \\uC544\\uB2D9\\uB2C8\\uB2E4");return}let n=Number(r.id);if(k){k=k.includes(n)?k.filter(s=>s!==n):k.length<2?[...k,n]:k,v();return}j=j===n?null:n,v();return}case"play":{let n=J().hand.find(o=>o.id===j);if(!n)return;let s=n.kind==="bang"||J().character==="calamityjanet"&&n.kind==="missed";if(!p.frame&&(s||Ve.includes(n.kind))){H={cardId:n.id},v();return}D({type:"play",cardId:n.id});return}case"respond":j!=null&&D({type:"respond",cardId:j});return;case"decline":D({type:"decline"});return;case"discard":j!=null&&D({type:"discard",cardId:j});return;case"end":D({type:"endTurn"});return;case"pick":D({type:"pick",cardId:Number(r.card)});return;case"kit":D({type:"kitReturn",cardId:Number(r.card)});return;case"jesse":D({type:"jesseDraw",from:r.from});return;case"pedro":D({type:"pedroDraw",from:r.from});return;case"sid":k=[],j=null,v();return;case"sidcancel":k=null,v();return;case"sidgo":k?.length===2&&D({type:"sid",cardIds:[k[0],k[1]]});return}});tt.bg&&(document.body.style.setProperty("--bgimg",`url(\'${tt.bg}\')`),document.body.classList.add("hasbg"));v();window.__bang={get state(){return P},get view(){return p},get net(){return $},startLocal:Kt,setCount:t=>{jt=t}};})();\n</script>\n';

// src/server.ts
var import_node_crypto = require("node:crypto");
var import_node_fs = require("node:fs");
var import_node_http = require("node:http");

// ../../../opt/npm-tools/node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// src/data.ts
var R = { J: 11, Q: 12, K: 13, A: 14 };
var rk = (s) => R[s] ?? Number(s);
function parse(code) {
  const suit = code.slice(-1);
  return [rk(code.slice(0, -1)), suit];
}
function range(from, to, suit) {
  const out = [];
  for (let r = from; r <= to; r++) out.push(`${r}${suit}`);
  return out;
}
var face = (suit, names) => names.map((n) => `${n}${suit}`);
var DECK_SPEC = {
  bang: ["AS", ...range(2, 10, "D"), ...face("D", ["J", "Q", "K", "A"]), ...range(2, 9, "C"), "AH", "KH", "QH"],
  missed: [...range(10, 10, "C"), ...face("C", ["J", "Q", "K", "A"]), ...range(2, 8, "S")],
  beer: range(6, 10, "H").concat(["JH"]),
  panic: ["JH", "QH", "AH", "8D"],
  catbalou: ["KH", "9D", "10D", "JD"],
  stagecoach: ["9S", "9S"],
  wellsfargo: ["3H"],
  generalstore: ["9C", "QS"],
  gatling: ["10H"],
  indians: ["KD", "AD"],
  duel: ["QD", "JS", "8C"],
  saloon: ["5H"],
  jail: ["10S", "JS", "4H"],
  dynamite: ["2H"],
  barrel: ["QS", "KS"],
  appaloosa: ["AS"],
  mustang: ["8H", "9H"],
  schofield: ["JC", "QC", "KS"],
  remington: ["KC"],
  carabine: ["AC"],
  winchester: ["8S"],
  volcanic: ["10S", "10C"]
};
var CARD_COUNTS = Object.fromEntries(
  Object.entries(DECK_SPEC).map(([k, v]) => [k, v.length])
);
function buildDeck() {
  const cards = [];
  let id = 1;
  for (const [kind, codes] of Object.entries(DECK_SPEC)) {
    for (const code of codes) {
      const [rank, suit] = parse(code);
      cards.push({ id: id++, kind, suit, rank });
    }
  }
  return cards;
}
var WEAPON_RANGE = {
  volcanic: 1,
  schofield: 2,
  remington: 3,
  carabine: 4,
  winchester: 5
};
var EQUIPMENT = [
  "dynamite",
  "barrel",
  "appaloosa",
  "mustang",
  ...Object.keys(WEAPON_RANGE)
];
var CHARACTERS = [
  { id: "bartcassidy", name: "\uBC14\uD2B8 \uCE90\uC2DC\uB514", hp: 4, text: "\uC0DD\uBA85\uC744 1\uC810 \uC783\uC744 \uB54C\uB9C8\uB2E4 \uB371\uC5D0\uC11C \uCE74\uB4DC 1\uC7A5\uC744 \uBF51\uB294\uB2E4." },
  { id: "blackjack", name: "\uBE14\uB799 \uC7AD", hp: 4, text: "\uB4DC\uB85C\uC6B0 \uB54C \uB450 \uBC88\uC9F8 \uCE74\uB4DC\uB97C \uACF5\uAC1C\uD55C\uB2E4. \uD558\uD2B8/\uB2E4\uC774\uC544\uBAAC\uB4DC\uBA74 1\uC7A5 \uB354 \uBF51\uB294\uB2E4." },
  { id: "calamityjanet", name: "\uCE98\uB7EC\uBA38\uD2F0 \uC7AC\uB2DB", hp: 4, text: "\uBC45!\uACFC \uBE57\uB098\uAC10!\uC744 \uC11C\uB85C \uB300\uC2E0\uD574\uC11C \uC0AC\uC6A9\uD560 \uC218 \uC788\uB2E4." },
  { id: "elgringo", name: "\uC5D8 \uADF8\uB9C1\uACE0", hp: 3, text: "\uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uC5D0\uAC8C \uC0DD\uBA85\uC744 \uC783\uC744 \uB54C\uB9C8\uB2E4 \uADF8 \uD50C\uB808\uC774\uC5B4\uC758 \uC190\uC5D0\uC11C \uCE74\uB4DC 1\uC7A5\uC744 \uAC00\uC838\uC628\uB2E4." },
  { id: "jessejones", name: "\uC81C\uC2DC \uC874\uC2A4", hp: 4, text: "\uCCAB \uBC88\uC9F8 \uCE74\uB4DC\uB97C \uB371 \uB610\uB294 \uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uC758 \uC190\uC5D0\uC11C \uBF51\uC744 \uC218 \uC788\uB2E4." },
  { id: "jourdonnais", name: "\uC870\uB974\uB3C4\uB124", hp: 4, text: "\uD56D\uC0C1 \uD1B5(Barrel)\uC744 \uAC00\uC9C4 \uAC83\uC73C\uB85C \uCDE8\uAE09\uD55C\uB2E4. \uC2E4\uC81C \uD1B5\uACFC \uD568\uAED8 \uC4F0\uBA74 \uD310\uC815\uC774 2\uBC88\uC774\uB2E4." },
  { id: "kitcarlson", name: "\uD0A4\uD2B8 \uCE7C\uC2A8", hp: 4, text: "\uB371 \uC704 3\uC7A5\uC744 \uBCF4\uACE0 2\uC7A5\uC744 \uAC00\uC838\uAC00\uBA70 1\uC7A5\uC740 \uB371 \uC704\uC5D0 \uB3CC\uB824\uB193\uB294\uB2E4." },
  { id: "luckyduke", name: "\uB7ED\uD0A4 \uB4C0\uD06C", hp: 4, text: '"Draw!" \uD310\uC815 \uB54C 2\uC7A5\uC744 \uB4A4\uC9D1\uC5B4 \uADF8\uC911 \uC720\uB9AC\uD55C 1\uC7A5\uC744 \uACE0\uB978\uB2E4.' },
  { id: "paulregret", name: "\uD3F4 \uB9AC\uADF8\uB81B", hp: 3, text: "\uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uAC00 \uBCFC \uB54C \uAC70\uB9AC\uAC00 +1 (\uBB34\uC2A4\uD0D5\uC744 \uB2E8 \uAC83\uACFC \uAC19\uC74C)." },
  { id: "pedroramirez", name: "\uD398\uB4DC\uB85C \uB77C\uBBF8\uB808\uC2A4", hp: 4, text: "\uCCAB \uBC88\uC9F8 \uCE74\uB4DC\uB97C \uBC84\uB9B0 \uB354\uBBF8 \uB9E8 \uC704\uC5D0\uC11C \uBF51\uC744 \uC218 \uC788\uB2E4." },
  { id: "rosedoolan", name: "\uB85C\uC988 \uB450\uB7F0", hp: 4, text: "\uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uB97C \uBCFC \uB54C \uAC70\uB9AC\uAC00 -1 (\uC544\uD314\uB8E8\uC0AC\uB97C \uB080 \uAC83\uACFC \uAC19\uC74C)." },
  { id: "sidketchum", name: "\uC2DC\uB4DC \uCF00\uCCA8", hp: 4, text: "\uC190\uD328 2\uC7A5\uC744 \uBC84\uB9AC\uACE0 \uC0DD\uBA85 1\uC810\uC744 \uD68C\uBCF5\uD560 \uC218 \uC788\uB2E4 (\uD69F\uC218 \uC81C\uD55C \uC5C6\uC74C)." },
  { id: "slabthekiller", name: "\uC2AC\uB7A9 \uB354 \uD0AC\uB7EC", hp: 4, text: "\uADF8\uC758 \uBC45!\uC744 \uB9C9\uC73C\uB824\uBA74 \uBE57\uB098\uAC10!\uC774 2\uC7A5 \uD544\uC694\uD558\uB2E4." },
  { id: "suzylafayette", name: "\uC218\uC9C0 \uB77C\uD30C\uC608\uD2B8", hp: 4, text: "\uC190\uD328\uAC00 0\uC7A5\uC774 \uB418\uB294 \uC989\uC2DC \uCE74\uB4DC 1\uC7A5\uC744 \uBF51\uB294\uB2E4." },
  { id: "vulturesam", name: "\uBC8C\uCC98 \uC0D8", hp: 4, text: "\uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uAC00 \uD0C8\uB77D\uD558\uBA74 \uADF8\uC758 \uBAA8\uB4E0 \uCE74\uB4DC\uB97C \uAC00\uC838\uC628\uB2E4." },
  { id: "willythekid", name: "\uC70C\uB9AC \uB354 \uD0A4\uB4DC", hp: 4, text: "\uBC45!\uC744 \uD134\uB2F9 \uD69F\uC218 \uC81C\uD55C \uC5C6\uC774 \uC0AC\uC6A9\uD560 \uC218 \uC788\uB2E4." }
];
var ROLE_SETS = {
  4: ["sheriff", "renegade", "outlaw", "outlaw"],
  5: ["sheriff", "renegade", "outlaw", "outlaw", "deputy"],
  6: ["sheriff", "renegade", "outlaw", "outlaw", "outlaw", "deputy"],
  7: ["sheriff", "renegade", "outlaw", "outlaw", "outlaw", "deputy", "deputy"]
};
var CARD_NAMES = {
  bang: "\uBC45!",
  missed: "\uBE57\uB098\uAC10!",
  beer: "\uB9E5\uC8FC",
  panic: "\uAC15\uD0C8!",
  catbalou: "\uCEA3 \uBC8C\uB85C\uC6B0",
  stagecoach: "\uC5ED\uB9C8\uCC28",
  wellsfargo: "\uC6F0\uC2A4 \uD30C\uACE0 \uC740\uD589",
  generalstore: "\uC7A1\uD654\uC810",
  gatling: "\uAE30\uAD00\uCD1D",
  indians: "\uC778\uB514\uC5B8!",
  duel: "\uACB0\uD22C",
  saloon: "\uC8FC\uC810",
  jail: "\uAC10\uC625",
  dynamite: "\uB2E4\uC774\uB108\uB9C8\uC774\uD2B8",
  barrel: "\uC220\uD1B5",
  appaloosa: "\uC870\uC900\uACBD",
  mustang: "\uC57C\uC0DD\uB9C8",
  schofield: "\uC2A4\uCF54\uD544\uB4DC",
  remington: "\uB808\uBC0D\uD134",
  carabine: "\uCE74\uBE48",
  winchester: "\uC708\uCCB4\uC2A4\uD130",
  volcanic: "\uBCFC\uCE90\uB2C9"
};

// src/engine.ts
var RuleError = class extends Error {
};
var fail = (msg) => {
  throw new RuleError(msg);
};
function rand(s) {
  s.seed = s.seed + 1831565813 | 0;
  let t = s.seed;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function shuffle(s, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand(s) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
var getPlayer = (s, id) => s.players.find((p) => p.id === id) ?? fail(`\uD50C\uB808\uC774\uC5B4 \uC5C6\uC74C: ${id}`);
var alivePlayers = (s) => s.players.filter((p) => p.alive);
var has = (p, kind) => p.table.some((c) => c.kind === kind);
var name = (k) => CARD_NAMES[k];
var log = (s, msg) => {
  s.log.push(msg);
  if (s.log.length > 200) s.log.shift();
};
function drawOne(s) {
  if (s.deck.length === 0 && s.discard.length > 0) {
    s.deck = shuffle(s, s.discard.splice(0));
  }
  return s.deck.pop();
}
function drawTo(s, p, n) {
  const got = [];
  for (let i = 0; i < n; i++) {
    const c = drawOne(s);
    if (!c) break;
    p.hand.push(c);
    got.push(c);
  }
  return got;
}
function removeFrom(list, id) {
  const i = list.findIndex((c) => c.id === id);
  if (i < 0) fail("\uD574\uB2F9 \uCE74\uB4DC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4");
  return list.splice(i, 1)[0];
}
function createGame(players, seed = Date.now() | 0) {
  const n = players.length;
  const roles = ROLE_SETS[n] ?? fail("4~7\uBA85\uB9CC \uD50C\uB808\uC774\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
  const s = { players: [], deck: [], discard: [], turn: 0, stack: [], winner: null, seed, log: [] };
  s.deck = shuffle(s, buildDeck());
  const seated = shuffle(s, [...players]);
  const rolePool = shuffle(s, [...roles]);
  const chars = shuffle(s, CHARACTERS.map((c) => c.id));
  seated.forEach((pl, i) => {
    const def = CHARACTERS.find((c) => c.id === chars[i]);
    const role = rolePool[i];
    const maxHp = def.hp + (role === "sheriff" ? 1 : 0);
    s.players.push({
      id: pl.id,
      name: pl.name,
      role,
      character: def.id,
      hp: maxHp,
      maxHp,
      hand: [],
      table: [],
      alive: true,
      bangsPlayed: 0
    });
  });
  for (const p of s.players) drawTo(s, p, p.maxHp);
  s.turn = s.players.findIndex((p) => p.role === "sheriff");
  s.stack.push({ t: "turnstart", pid: s.players[s.turn].id, step: "dynamite" });
  log(s, "\uAC8C\uC784 \uC2DC\uC791! \uBCF4\uC548\uAD00\uBD80\uD130 \uC2DC\uC791\uD569\uB2C8\uB2E4.");
  advance(s);
  return s;
}
function weaponRange(p) {
  let r = 1;
  for (const c of p.table) {
    const w = WEAPON_RANGE[c.kind];
    if (w) r = w;
  }
  return r;
}
function distance(s, from, to) {
  const live = alivePlayers(s);
  const i = live.findIndex((p) => p.id === from);
  const j = live.findIndex((p) => p.id === to);
  if (i < 0 || j < 0) fail("\uB300\uC0C1\uC774 \uC0B4\uC544\uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4");
  const raw = Math.abs(i - j);
  let d = Math.min(raw, live.length - raw);
  const a = live[i], b = live[j];
  d += (has(b, "mustang") ? 1 : 0) + (b.character === "paulregret" ? 1 : 0);
  d -= (has(a, "appaloosa") ? 1 : 0) + (a.character === "rosedoolan" ? 1 : 0);
  return Math.max(1, d);
}
function check(s, p, good) {
  const n = p.character === "luckyduke" ? 2 : 1;
  const flipped = [];
  for (let i = 0; i < n; i++) {
    const c = drawOne(s);
    if (c) flipped.push(c);
  }
  s.discard.push(...flipped);
  const ok = flipped.some(good);
  log(s, `${p.name} \uD310\uC815: ${flipped.map(cardText).join(", ")} \u2192 ${ok ? "\uC131\uACF5" : "\uC2E4\uD328"}`);
  return ok;
}
var SUIT = { S: "\u2660", H: "\u2665", D: "\u2666", C: "\u2663" };
var RANK = { 11: "J", 12: "Q", 13: "K", 14: "A" };
var cardText = (c) => `${name(c.kind)}(${SUIT[c.suit]}${RANK[c.rank] ?? c.rank})`;
function missedCards(p) {
  return p.hand.filter((c) => c.kind === "missed" || p.character === "calamityjanet" && c.kind === "bang");
}
function bangCards(p) {
  return p.hand.filter((c) => c.kind === "bang" || p.character === "calamityjanet" && c.kind === "missed");
}
function startBang(s, src, tgt, needed) {
  const barrels = (has(tgt, "barrel") ? 1 : 0) + (tgt.character === "jourdonnais" ? 1 : 0);
  for (let i = 0; i < barrels && needed > 0; i++) {
    if (check(s, tgt, (c) => c.suit === "H")) needed--;
  }
  if (needed <= 0) {
    log(s, `${tgt.name}\uC774(\uAC00) \uC220\uD1B5\uC73C\uB85C \uD53C\uD588\uB2E4!`);
    return;
  }
  if (missedCards(tgt).length === 0) {
    hit(s, tgt, 1, src);
    return;
  }
  s.stack.push({ t: "bang", src: src?.id ?? null, tgt: tgt.id, needed });
}
function hit(s, victim, n, src) {
  victim.hp -= n;
  log(s, `${victim.name} \uC0DD\uBA85 -${n} (\uB0A8\uC740 \uC0DD\uBA85 ${victim.hp})`);
  if (victim.hp <= 0) s.stack.push({ t: "dying", tgt: victim.id, src: src?.id ?? null, dmg: n });
  else onHit(s, victim, n, src);
}
function onHit(s, victim, n, src) {
  if (!victim.alive) return;
  if (victim.character === "bartcassidy") {
    drawTo(s, victim, n);
    log(s, `${victim.name}: \uCE74\uB4DC ${n}\uC7A5 \uBF51\uC74C`);
  }
  if (victim.character === "elgringo" && src && src.id !== victim.id) {
    for (let i = 0; i < n && src.hand.length > 0; i++) {
      const c = src.hand.splice(Math.floor(rand(s) * src.hand.length), 1)[0];
      victim.hand.push(c);
      log(s, `${victim.name}\uC774(\uAC00) ${src.name}\uC758 \uC190\uC5D0\uC11C \uCE74\uB4DC 1\uC7A5\uC744 \uAC00\uC838\uC634`);
    }
  }
}
function heal(s, p, n = 1) {
  const before = p.hp;
  p.hp = Math.min(p.maxHp, p.hp + n);
  if (p.hp !== before) log(s, `${p.name} \uC0DD\uBA85 +${p.hp - before} (${p.hp})`);
}
function kill(s, victim, src) {
  victim.alive = false;
  victim.hp = Math.min(0, victim.hp);
  log(s, `${victim.name} \uD0C8\uB77D! \uC5ED\uD560: ${roleName(victim.role)}`);
  const loot = [...victim.hand, ...victim.table];
  victim.hand = [];
  victim.table = [];
  const vulture = alivePlayers(s).find((p) => p.character === "vulturesam");
  if (vulture) {
    vulture.hand.push(...loot);
    if (loot.length) log(s, `${vulture.name}\uC774(\uAC00) ${loot.length}\uC7A5\uC744 \uAC00\uC838\uAC10`);
  } else s.discard.push(...loot);
  const w = checkWin(s);
  if (w) {
    s.winner = w;
    s.stack = [];
    log(s, `\uAC8C\uC784 \uC885\uB8CC: ${winnerName(w)} \uC2B9\uB9AC!`);
    return;
  }
  if (src && src.alive && src.id !== victim.id) {
    if (victim.role === "outlaw") {
      drawTo(s, src, 3);
      log(s, `${src.name}: \uBB34\uBC95\uC790 \uCC98\uCE58 \uBCF4\uC0C1\uC73C\uB85C 3\uC7A5 \uBF51\uC74C`);
    } else if (victim.role === "deputy" && src.role === "sheriff") {
      s.discard.push(...src.hand, ...src.table);
      src.hand = [];
      src.table = [];
      log(s, `\uBCF4\uC548\uAD00\uC774 \uBD80\uBCF4\uC548\uAD00\uC744 \uC3D8\uC558\uB2E4! \uBAA8\uB4E0 \uCE74\uB4DC\uB97C \uBC84\uB9BD\uB2C8\uB2E4.`);
    }
  }
}
var roleName = (r) => ({ sheriff: "\uBCF4\uC548\uAD00", deputy: "\uBD80\uBCF4\uC548\uAD00", outlaw: "\uBB34\uBC95\uC790", renegade: "\uBC30\uC2E0\uC790" })[r];
var winnerName = (w) => ({ sheriff: "\uBCF4\uC548\uAD00 \uD300", outlaws: "\uBB34\uBC95\uC790 \uD300", renegade: "\uBC30\uC2E0\uC790" })[w];
function checkWin(s) {
  const live = alivePlayers(s);
  const sheriffAlive = live.some((p) => p.role === "sheriff");
  if (!sheriffAlive) return live.length === 1 && live[0].role === "renegade" ? "renegade" : "outlaws";
  if (!live.some((p) => p.role === "outlaw" || p.role === "renegade")) return "sheriff";
  return null;
}
function actor(s) {
  if (s.winner) return null;
  const top = s.stack[s.stack.length - 1];
  if (!top) return s.players[s.turn].id;
  switch (top.t) {
    case "bang":
    case "indians":
    case "dying":
      return top.tgt;
    case "duel":
      return top.cur;
    case "store":
      return top.order[0] ?? null;
    case "kit":
    case "jesse":
    case "pedro":
      return top.pid;
    default:
      return null;
  }
}
function nextTurn(s) {
  const n = s.players.length;
  let i = s.turn;
  do {
    i = (i + 1) % n;
  } while (!s.players[i].alive);
  s.turn = i;
  s.players[i].bangsPlayed = 0;
  s.stack.push({ t: "turnstart", pid: s.players[i].id, step: "dynamite" });
  log(s, `\u2500\u2500 ${s.players[i].name}\uC758 \uD134 \u2500\u2500`);
}
function canBeSaved(s, p) {
  const beer = alivePlayers(s).length > 2 && p.hand.some((c) => c.kind === "beer");
  const sid = p.character === "sidketchum" && p.hand.length >= 2;
  return beer || sid;
}
function advance(s) {
  for (let guard = 0; guard < 1e4; guard++) {
    if (s.winner) {
      s.stack = [];
      return;
    }
    const top = s.stack[s.stack.length - 1];
    if (!top) {
      if (!s.players[s.turn].alive) {
        nextTurn(s);
        continue;
      }
      suzy(s);
      return;
    }
    switch (top.t) {
      case "turnstart": {
        const p = getPlayer(s, top.pid);
        if (!p.alive) {
          s.stack.pop();
          nextTurn(s);
          continue;
        }
        if (top.step === "dynamite") {
          top.step = "jail";
          const dyn = p.table.find((c) => c.kind === "dynamite");
          if (dyn) {
            if (check(s, p, (c) => c.suit === "S" && c.rank >= 2 && c.rank <= 9)) {
              p.table.splice(p.table.indexOf(dyn), 1);
              s.discard.push(dyn);
              log(s, "\uB2E4\uC774\uB108\uB9C8\uC774\uD2B8\uAC00 \uD3ED\uBC1C\uD588\uB2E4!");
              hit(s, p, 3, null);
            } else {
              p.table.splice(p.table.indexOf(dyn), 1);
              const live = alivePlayers(s);
              const next = live[(live.indexOf(p) + 1) % live.length];
              next.table.push(dyn);
              log(s, `\uB2E4\uC774\uB108\uB9C8\uC774\uD2B8\uAC00 ${next.name}\uC5D0\uAC8C \uB118\uC5B4\uAC14\uB2E4`);
            }
          }
          continue;
        }
        if (top.step === "jail") {
          top.step = "draw";
          const jail = p.table.find((c) => c.kind === "jail");
          if (jail) {
            p.table.splice(p.table.indexOf(jail), 1);
            s.discard.push(jail);
            if (check(s, p, (c) => c.suit === "H")) log(s, `${p.name} \uAC10\uC625 \uD0C8\uCD9C!`);
            else {
              log(s, `${p.name}\uC740(\uB294) \uAC10\uC625\uC5D0 \uAC07\uD600 \uD134\uC744 \uAC74\uB108\uB701\uB2C8\uB2E4`);
              s.stack.pop();
              nextTurn(s);
            }
          }
          continue;
        }
        s.stack.pop();
        startDraw(s, p);
        continue;
      }
      case "multi": {
        const src = getPlayer(s, top.src);
        let next;
        while (top.rest.length && !next) {
          const cand = getPlayer(s, top.rest.shift());
          if (cand.alive) next = cand;
        }
        if (!next) {
          s.stack.pop();
          continue;
        }
        if (top.kind === "gatling") startBang(s, src, next, 1);
        else if (bangCards(next).length === 0) hit(s, next, 1, src);
        else s.stack.push({ t: "indians", src: src.id, tgt: next.id });
        continue;
      }
      case "dying": {
        const p = getPlayer(s, top.tgt);
        if (p.hp > 0) {
          s.stack.pop();
          onHit(s, p, top.dmg, top.src ? getPlayer(s, top.src) : null);
          continue;
        }
        if (!canBeSaved(s, p)) {
          s.stack.pop();
          kill(s, p, top.src ? getPlayer(s, top.src) : null);
          continue;
        }
        return;
      }
      case "store": {
        top.order = top.order.filter((id) => getPlayer(s, id).alive);
        if (top.order.length === 0 || top.cards.length === 0) {
          s.discard.push(...top.cards);
          s.stack.pop();
          continue;
        }
        if (top.order.length === 1 && top.cards.length === 1) {
          const last = getPlayer(s, top.order[0]);
          last.hand.push(top.cards[0]);
          s.stack.pop();
          continue;
        }
        return;
      }
      default:
        suzy(s);
        return;
    }
  }
  throw new Error("advance \uB8E8\uD504 \uCD08\uACFC");
}
function suzy(s) {
  const top = s.stack[s.stack.length - 1];
  if (top && ["turnstart", "kit", "jesse", "pedro", "dying"].includes(top.t)) return;
  for (const p of s.players) {
    if (p.alive && p.character === "suzylafayette" && p.hand.length === 0) {
      drawTo(s, p, 1);
      log(s, `${p.name}: \uC190\uD328\uAC00 \uBE44\uC5B4 1\uC7A5 \uBF51\uC74C`);
    }
  }
}
function startDraw(s, p) {
  switch (p.character) {
    case "jessejones":
      if (s.players.some((o) => o.alive && o.id !== p.id && o.hand.length > 0)) {
        s.stack.push({ t: "jesse", pid: p.id });
        return;
      }
      break;
    case "kitcarlson": {
      const cards = [];
      for (let i = 0; i < 3; i++) {
        const c = drawOne(s);
        if (c) cards.push(c);
      }
      s.stack.push({ t: "kit", pid: p.id, cards });
      return;
    }
    case "pedroramirez":
      if (s.discard.length > 0) {
        s.stack.push({ t: "pedro", pid: p.id });
        return;
      }
      break;
    case "blackjack": {
      const [a, b] = drawTo(s, p, 2);
      if (b) {
        log(s, `${p.name}: \uB450 \uBC88\uC9F8 \uCE74\uB4DC \uACF5\uAC1C ${cardText(b)}`);
        if (b.suit === "H" || b.suit === "D") drawTo(s, p, 1);
      }
      void a;
      return;
    }
  }
  drawTo(s, p, 2);
}
function apply(s, pid, a) {
  if (s.winner) fail("\uAC8C\uC784\uC774 \uC774\uBBF8 \uB05D\uB0AC\uC2B5\uB2C8\uB2E4");
  const p = getPlayer(s, pid);
  if (!p.alive) fail("\uD0C8\uB77D\uD55C \uD50C\uB808\uC774\uC5B4\uC785\uB2C8\uB2E4");
  if (actor(s) !== pid) fail("\uC9C0\uAE08\uC740 \uB2F9\uC2E0\uC774 \uD589\uB3D9\uD560 \uCC28\uB840\uAC00 \uC544\uB2D9\uB2C8\uB2E4");
  const top = s.stack[s.stack.length - 1];
  switch (a.type) {
    case "play":
      return void (doPlay(s, p, top, a), advance(s));
    case "respond":
      return void (doRespond(s, p, top, a.cardId), advance(s));
    case "decline":
      return void (doDecline(s, p, top), advance(s));
    case "pick":
      return void (doPick(s, p, top, a.cardId), advance(s));
    case "kitReturn":
      return void (doKit(s, p, top, a.cardId), advance(s));
    case "jesseDraw":
      return void (doJesse(s, p, top, a.from), advance(s));
    case "pedroDraw":
      return void (doPedro(s, p, top, a.from), advance(s));
    case "sid":
      return void (doSid(s, p, top, a.cardIds), advance(s));
    case "discard":
      return void (doDiscard(s, p, top, a.cardId), advance(s));
    case "endTurn":
      return void (doEndTurn(s, p, top), advance(s));
  }
  fail("\uC54C \uC218 \uC5C6\uB294 \uD589\uB3D9");
}
function doRespond(s, p, top, cardId) {
  const card = p.hand.find((c) => c.id === cardId) ?? fail("\uC190\uC5D0 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4");
  if (top?.t === "bang") {
    if (!missedCards(p).includes(card)) fail("\uBE57\uB098\uAC10!\uC73C\uB85C \uC4F8 \uC218 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4");
    removeFrom(p.hand, cardId);
    s.discard.push(card);
    log(s, card.kind === "missed" ? `${p.name}: \uBE57\uB098\uAC10!\uC73C\uB85C \uBC29\uC5B4` : `${p.name}: ${name(card.kind)}\uC744(\uB97C) \uBE57\uB098\uAC10!\uC73C\uB85C \uC0AC\uC6A9`);
    if (--top.needed <= 0) s.stack.pop();
  } else if (top?.t === "indians") {
    if (!bangCards(p).includes(card)) fail("\uBC45!\uC73C\uB85C \uC4F8 \uC218 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4");
    removeFrom(p.hand, cardId);
    s.discard.push(card);
    log(s, `${p.name}: ${name(card.kind)}\uC73C\uB85C \uC778\uB514\uC5B8\uC744 \uB9C9\uC74C`);
    s.stack.pop();
  } else if (top?.t === "duel") {
    if (!bangCards(p).includes(card)) fail("\uBC45!\uC73C\uB85C \uC4F8 \uC218 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4");
    removeFrom(p.hand, cardId);
    s.discard.push(card);
    log(s, `${p.name}: \uACB0\uD22C\uC5D0\uC11C \uBC45! \uC751\uC218`);
    top.cur = top.cur === top.src ? top.tgt : top.src;
    if (bangCards(getPlayer(s, top.cur)).length === 0) {
      const loser = getPlayer(s, top.cur);
      const winner = getPlayer(s, top.cur === top.src ? top.tgt : top.src);
      s.stack.pop();
      hit(s, loser, 1, winner);
    }
  } else fail("\uC9C0\uAE08\uC740 \uC751\uB2F5\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
}
function doDecline(s, p, top) {
  if (top?.t === "bang") {
    s.stack.pop();
    hit(s, p, 1, top.src ? getPlayer(s, top.src) : null);
  } else if (top?.t === "indians") {
    s.stack.pop();
    hit(s, p, 1, getPlayer(s, top.src));
  } else if (top?.t === "duel") {
    const other = getPlayer(s, top.cur === top.src ? top.tgt : top.src);
    s.stack.pop();
    hit(s, p, 1, other);
  } else if (top?.t === "dying") {
    s.stack.pop();
    kill(s, p, top.src ? getPlayer(s, top.src) : null);
  } else fail("\uD3EC\uAE30\uD560 \uC218 \uC5C6\uB294 \uC0C1\uD669\uC785\uB2C8\uB2E4");
}
function doPick(s, p, top, cardId) {
  if (top?.t !== "store") fail("\uC7A1\uD654\uC810 \uC911\uC774 \uC544\uB2D9\uB2C8\uB2E4");
  const st = top;
  const card = removeFrom(st.cards, cardId);
  p.hand.push(card);
  st.order.shift();
  log(s, `${p.name}: \uC7A1\uD654\uC810\uC5D0\uC11C ${name(card.kind)} \uC120\uD0DD`);
}
function doKit(s, p, top, cardId) {
  if (top?.t !== "kit") fail("\uD0A4\uD2B8 \uCE7C\uC2A8\uC758 \uC120\uD0DD \uB2E8\uACC4\uAC00 \uC544\uB2D9\uB2C8\uB2E4");
  const kit = top;
  const back = removeFrom(kit.cards, cardId);
  s.deck.push(back);
  p.hand.push(...kit.cards);
  s.stack.pop();
}
function doJesse(s, p, top, from) {
  if (top?.t !== "jesse") fail("\uC81C\uC2DC \uC874\uC2A4\uC758 \uC120\uD0DD \uB2E8\uACC4\uAC00 \uC544\uB2D9\uB2C8\uB2E4");
  if (from === "deck") drawTo(s, p, 2);
  else {
    const o = getPlayer(s, from);
    if (!o.alive || o.id === p.id || o.hand.length === 0) fail("\uADF8 \uD50C\uB808\uC774\uC5B4\uC758 \uC190\uC5D0\uC11C\uB294 \uBF51\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
    p.hand.push(o.hand.splice(Math.floor(rand(s) * o.hand.length), 1)[0]);
    log(s, `${p.name}\uC774(\uAC00) ${o.name}\uC758 \uC190\uC5D0\uC11C 1\uC7A5 \uBF51\uC74C`);
    drawTo(s, p, 1);
  }
  s.stack.pop();
}
function doPedro(s, p, top, from) {
  if (top?.t !== "pedro") fail("\uD398\uB4DC\uB85C \uB77C\uBBF8\uB808\uC2A4\uC758 \uC120\uD0DD \uB2E8\uACC4\uAC00 \uC544\uB2D9\uB2C8\uB2E4");
  if (from === "discard") {
    if (s.discard.length === 0) fail("\uBC84\uB9B0 \uB354\uBBF8\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4");
    p.hand.push(s.discard.pop());
    drawTo(s, p, 1);
  } else drawTo(s, p, 2);
  s.stack.pop();
}
function doSid(s, p, top, ids) {
  if (p.character !== "sidketchum") fail("\uC2DC\uB4DC \uCF00\uCCA8\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
  if (ids[0] === ids[1]) fail("\uC11C\uB85C \uB2E4\uB978 \uCE74\uB4DC 2\uC7A5\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
  if (p.hp >= p.maxHp) fail("\uC774\uBBF8 \uC0DD\uBA85\uC774 \uAC00\uB4DD \uCC3C\uC2B5\uB2C8\uB2E4");
  if (top && top.t !== "dying" && top.t !== "bang" && top.t !== "indians" && top.t !== "duel") fail("\uC9C0\uAE08\uC740 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
  const cards = ids.map((id) => p.hand.find((c) => c.id === id) ?? fail("\uC190\uC5D0 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4"));
  for (const c of cards) {
    removeFrom(p.hand, c.id);
    s.discard.push(c);
  }
  heal(s, p);
}
function doDiscard(s, p, top, cardId) {
  if (top) fail("\uC9C0\uAE08\uC740 \uBC84\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
  if (p.hand.length <= Math.max(p.hp, 0)) fail("\uC190\uD328\uAC00 \uC0DD\uBA85 \uC774\uD558\uC774\uBBC0\uB85C \uBC84\uB9B4 \uD544\uC694\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4");
  s.discard.push(removeFrom(p.hand, cardId));
}
function doEndTurn(s, p, top) {
  if (top) fail("\uC9C0\uAE08\uC740 \uD134\uC744 \uB05D\uB0BC \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
  if (p.hand.length > p.hp) fail(`\uC190\uD328\uB294 \uC0DD\uBA85(${p.hp})\uC7A5 \uC774\uD558\uC5EC\uC57C \uD569\uB2C8\uB2E4. \uCE74\uB4DC\uB97C \uBC84\uB9AC\uC138\uC694`);
  nextTurn(s);
}
function doPlay(s, p, top, a) {
  const card = p.hand.find((c) => c.id === a.cardId) ?? fail("\uC190\uC5D0 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4");
  if (top?.t === "dying") {
    if (card.kind !== "beer") fail("\uC0DD\uBA85\uC774 0 \uC774\uD558\uC77C \uB54C\uB294 \uB9E5\uC8FC\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
    if (alivePlayers(s).length <= 2) fail("2\uBA85\uB9CC \uB0A8\uC73C\uBA74 \uB9E5\uC8FC\uB294 \uD6A8\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4");
    removeFrom(p.hand, card.id);
    s.discard.push(card);
    heal(s, p);
    return;
  }
  if (top) fail("\uC9C0\uAE08\uC740 \uCE74\uB4DC\uB97C \uB0BC \uC218 \uC5C6\uC2B5\uB2C8\uB2E4 (\uC751\uB2F5/\uC120\uD0DD \uD544\uC694)");
  const target = a.target ? getPlayer(s, a.target) : void 0;
  const needTarget = () => {
    if (!target) fail("\uB300\uC0C1\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
    if (!target.alive) fail("\uD0C8\uB77D\uD55C \uB300\uC0C1\uC785\uB2C8\uB2E4");
    if (target.id === p.id) fail("\uC790\uAE30 \uC790\uC2E0\uC740 \uB300\uC0C1\uC774 \uB420 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
    return target;
  };
  const used = () => {
    removeFrom(p.hand, card.id);
    s.discard.push(card);
  };
  const others = () => {
    const live = alivePlayers(s);
    const i = live.indexOf(p);
    return [...live.slice(i + 1), ...live.slice(0, i)];
  };
  const asBang = card.kind === "bang" || p.character === "calamityjanet" && card.kind === "missed";
  if (asBang) {
    const t = needTarget();
    const unlimited = has(p, "volcanic") || p.character === "willythekid";
    if (!unlimited && p.bangsPlayed >= 1) fail("\uC774\uBC88 \uD134\uC5D0\uB294 \uC774\uBBF8 \uBC45!\uC744 \uC0AC\uC6A9\uD588\uC2B5\uB2C8\uB2E4");
    if (distance(s, p.id, t.id) > weaponRange(p)) fail("\uC0AC\uAC70\uB9AC \uBC16\uC785\uB2C8\uB2E4");
    used();
    p.bangsPlayed++;
    log(s, `${p.name} \u2192 ${t.name}: \uBC45!`);
    startBang(s, p, t, p.character === "slabthekiller" ? 2 : 1);
    return;
  }
  switch (card.kind) {
    case "missed":
      fail("\uBE57\uB098\uAC10!\uC740 \uACF5\uACA9\uC744 \uBC1B\uC558\uC744 \uB54C\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
      break;
    case "beer":
      if (alivePlayers(s).length <= 2) fail("2\uBA85\uB9CC \uB0A8\uC73C\uBA74 \uB9E5\uC8FC\uB294 \uD6A8\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4");
      used();
      heal(s, p);
      log(s, `${p.name}: \uB9E5\uC8FC`);
      break;
    case "saloon":
      used();
      for (const o of alivePlayers(s)) heal(s, o);
      log(s, `${p.name}: \uC8FC\uC810`);
      break;
    case "stagecoach":
      used();
      drawTo(s, p, 2);
      log(s, `${p.name}: \uC5ED\uB9C8\uCC28`);
      break;
    case "wellsfargo":
      used();
      drawTo(s, p, 3);
      log(s, `${p.name}: \uC6F0\uC2A4 \uD30C\uACE0 \uC740\uD589`);
      break;
    case "panic":
    case "catbalou": {
      const t = needTarget();
      if (card.kind === "panic" && distance(s, p.id, t.id) > 1) fail("\uAC15\uD0C8!\uC740 \uAC70\uB9AC 1 \uC774\uB0B4\uC5D0\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
      const ref = a.targetCard ?? fail("\uAC00\uC838\uC62C/\uBC84\uB9B4 \uCE74\uB4DC\uB97C \uC9C0\uC815\uD574\uC57C \uD569\uB2C8\uB2E4");
      let taken;
      if (ref.zone === "hand") {
        if (t.hand.length === 0) fail("\uC190\uD328\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4");
        taken = t.hand.splice(Math.floor(rand(s) * t.hand.length), 1)[0];
      } else taken = removeFrom(t.table, ref.cardId);
      used();
      if (card.kind === "panic") {
        p.hand.push(taken);
        log(s, `${p.name}\uC774(\uAC00) ${t.name}\uC5D0\uAC8C\uC11C \uCE74\uB4DC\uB97C \uAC00\uC838\uC634 (\uAC15\uD0C8!)`);
      } else {
        s.discard.push(taken);
        log(s, `${p.name}\uC774(\uAC00) ${t.name}\uC758 ${ref.zone === "hand" ? "\uC190\uD328 1\uC7A5" : name(taken.kind)}\uC744(\uB97C) \uBC84\uB9AC\uAC8C \uD568 (\uCEA3 \uBC8C\uB85C\uC6B0)`);
      }
      break;
    }
    case "generalstore": {
      used();
      const order = alivePlayers(s).map((x) => x.id);
      const start = order.indexOf(p.id);
      const rotated = [...order.slice(start), ...order.slice(0, start)];
      const cards = [];
      for (let i = 0; i < rotated.length; i++) {
        const c = drawOne(s);
        if (c) cards.push(c);
      }
      s.stack.push({ t: "store", cards, order: rotated });
      log(s, `${p.name}: \uC7A1\uD654\uC810 \u2014 ${cards.map(cardText).join(", ")}`);
      break;
    }
    case "gatling":
      used();
      s.stack.push({ t: "multi", kind: "gatling", src: p.id, rest: others().map((x) => x.id) });
      log(s, `${p.name}: \uAE30\uAD00\uCD1D!`);
      break;
    case "indians":
      used();
      s.stack.push({ t: "multi", kind: "indians", src: p.id, rest: others().map((x) => x.id) });
      log(s, `${p.name}: \uC778\uB514\uC5B8!`);
      break;
    case "duel": {
      const t = needTarget();
      used();
      log(s, `${p.name} \u2192 ${t.name}: \uACB0\uD22C!`);
      if (bangCards(t).length === 0) hit(s, t, 1, p);
      else s.stack.push({ t: "duel", src: p.id, tgt: t.id, cur: t.id });
      break;
    }
    case "jail": {
      const t = needTarget();
      if (t.role === "sheriff") fail("\uBCF4\uC548\uAD00\uC5D0\uAC8C\uB294 \uAC10\uC625\uC744 \uAC78 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
      if (has(t, "jail")) fail("\uC774\uBBF8 \uAC10\uC625\uC5D0 \uAC07\uD600 \uC788\uC2B5\uB2C8\uB2E4");
      removeFrom(p.hand, card.id);
      t.table.push(card);
      log(s, `${p.name} \u2192 ${t.name}: \uAC10\uC625!`);
      break;
    }
    default: {
      if (!EQUIPMENT.includes(card.kind)) fail("\uC0AC\uC6A9\uD560 \uC218 \uC5C6\uB294 \uCE74\uB4DC\uC785\uB2C8\uB2E4");
      if (WEAPON_RANGE[card.kind]) {
        const old = p.table.find((c) => WEAPON_RANGE[c.kind]);
        if (old) {
          p.table.splice(p.table.indexOf(old), 1);
          s.discard.push(old);
        }
      } else if (has(p, card.kind)) fail("\uAC19\uC740 \uC7A5\uBE44\uB97C \uC774\uBBF8 \uAC00\uC9C0\uACE0 \uC788\uC2B5\uB2C8\uB2E4");
      removeFrom(p.hand, card.id);
      p.table.push(card);
      log(s, `${p.name}: ${name(card.kind)} \uC7A5\uCC29`);
    }
  }
}
function viewFor(s, pid) {
  const top = s.stack[s.stack.length - 1];
  let frame = null;
  if (top) {
    frame = { ...top };
    if (top.t === "kit" && top.pid !== pid) frame.cards = top.cards.length;
  }
  return {
    you: pid,
    turn: s.players[s.turn].id,
    actor: actor(s),
    winner: s.winner,
    deckCount: s.deck.length,
    discardTop: s.discard[s.discard.length - 1] ?? null,
    frame,
    players: s.players.map((p) => ({
      id: p.id,
      name: p.name,
      character: p.character,
      hp: p.hp,
      maxHp: p.maxHp,
      alive: p.alive,
      handCount: p.hand.length,
      table: p.table,
      role: p.id === pid || p.role === "sheriff" || !p.alive || s.winner ? p.role : null,
      hand: p.id === pid ? p.hand : void 0
    })),
    log: s.log.slice(-40)
  };
}

// client/bot.ts
var ENEMY_OF = {
  sheriff: ["outlaw", "renegade", "deputy"],
  deputy: ["outlaw", "renegade"],
  outlaw: ["sheriff", "deputy", "renegade", "outlaw"],
  renegade: ["outlaw", "sheriff", "deputy"]
};
function botMove(s, pid) {
  const p = s.players.find((x) => x.id === pid);
  const top = s.stack[s.stack.length - 1];
  const others = s.players.filter((o) => o.alive && o.id !== pid);
  const pref = ENEMY_OF[p.role];
  const sorted = [...others].sort((a, b) => {
    const ra = a.role === "sheriff" && p.role !== "sheriff" ? 0 : 1;
    const rb = b.role === "sheriff" && p.role !== "sheriff" ? 0 : 1;
    return p.role === "outlaw" ? ra - rb : Math.random() - 0.5;
  });
  const c = [];
  const hand = p.hand;
  const of = (...k) => hand.filter((h) => k.includes(h.kind));
  if (!top) {
    if (p.hp < p.maxHp) for (const h of of("beer")) c.push({ type: "play", cardId: h.id });
    for (const h of of("barrel", "mustang", "appaloosa", "schofield", "remington", "carabine", "winchester", "dynamite"))
      c.push({ type: "play", cardId: h.id });
    for (const h of of("stagecoach", "wellsfargo", "generalstore", "gatling", "indians"))
      c.push({ type: "play", cardId: h.id });
    if (p.hp < p.maxHp - 1) for (const h of of("saloon")) c.push({ type: "play", cardId: h.id });
    for (const h of of("jail")) for (const o of sorted) c.push({ type: "play", cardId: h.id, target: o.id });
    for (const h of of("duel")) for (const o of sorted) c.push({ type: "play", cardId: h.id, target: o.id });
    for (const h of of("panic", "catbalou"))
      for (const o of sorted) {
        for (const t of o.table) c.push({ type: "play", cardId: h.id, target: o.id, targetCard: { zone: "table", cardId: t.id } });
        c.push({ type: "play", cardId: h.id, target: o.id, targetCard: { zone: "hand" } });
      }
    for (const h of of("bang")) for (const o of sorted) c.push({ type: "play", cardId: h.id, target: o.id });
    c.push({ type: "endTurn" });
    for (const h of hand) c.push({ type: "discard", cardId: h.id });
  } else if (top.t === "bang") {
    for (const h of hand) c.push({ type: "respond", cardId: h.id });
    c.push({ type: "decline" });
  } else if (top.t === "indians" || top.t === "duel") {
    for (const h of hand) c.push({ type: "respond", cardId: h.id });
    c.push({ type: "decline" });
  } else if (top.t === "dying") {
    for (const h of of("beer")) c.push({ type: "play", cardId: h.id });
    c.push({ type: "decline" });
  } else if (top.t === "store") {
    for (const k of top.cards) c.push({ type: "pick", cardId: k.id });
  } else if (top.t === "kit") {
    for (const k of [...top.cards].reverse()) c.push({ type: "kitReturn", cardId: k.id });
  } else if (top.t === "jesse") {
    c.push({ type: "jesseDraw", from: "deck" });
  } else if (top.t === "pedro") {
    c.push({ type: "pedroDraw", from: "deck" });
  }
  void pref;
  for (const a of c) {
    const snap = structuredClone(s);
    try {
      apply(snap, pid, a);
    } catch (e) {
      if (e instanceof RuleError) continue;
      throw e;
    }
    apply(s, pid, a);
    return;
  }
  throw new Error(`\uBD07\uC774 \uD589\uB3D9\uD560 \uC218 \uC5C6\uC74C: ${JSON.stringify(top)} actor=${actor(s)}`);
}

// src/server.ts
var MAX_PLAYERS = 7;
var BOT_MS = 750;
var OFFLINE_MS = 15e3;
function createBangServer(port2, opts = {}) {
  const rooms = /* @__PURE__ */ new Map();
  const http = (0, import_node_http.createServer)((req, res) => {
    const url = (req.url ?? "/").split("?")[0];
    if (url === "/healthz") {
      res.writeHead(200, { "content-type": "text/plain" });
      return void res.end("ok");
    }
    if (opts.html && (url === "/" || url === "/index.html")) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" });
      return void res.end(opts.html);
    }
    res.writeHead(404);
    res.end("not found");
  });
  const wss = new import_websocket_server.default({ server: http });
  const listening = new Promise((r) => http.listen(port2, () => r(http.address().port)));
  const send = (ws, msg) => {
    if (ws && ws.readyState === import_websocket.default.OPEN) ws.send(JSON.stringify(msg));
  };
  const hostOf = (r) => r.members.find((m) => !m.bot);
  function broadcast(room) {
    const host = hostOf(room)?.id;
    if (!room.game) {
      const lobby = { type: "lobby", room: room.code, host, players: room.members.map((m) => ({ id: m.id, name: m.name, online: !!m.ws || !!m.bot, bot: !!m.bot })) };
      for (const m of room.members) send(m.ws, lobby);
    } else {
      for (const m of room.members) send(m.ws, { type: "state", room: room.code, host, view: viewFor(room.game, m.id) });
    }
  }
  function schedule(room) {
    clearTimeout(room.timer);
    room.timer = void 0;
    const g = room.game;
    if (!g || g.winner) return;
    const a = actor(g);
    const m = a ? room.members.find((x) => x.id === a) : void 0;
    if (!a || !m) return;
    let delay;
    if (m.bot || !m.ws) {
      const humansAlive = room.members.some((x) => !x.bot && g.players.find((p) => p.id === x.id)?.alive);
      delay = m.bot ? humansAlive ? BOT_MS : 120 : OFFLINE_MS;
    } else return;
    room.timer = setTimeout(() => {
      try {
        botMove(g, a);
      } catch (e) {
        console.error("bot error", e);
        return;
      }
      broadcast(room);
      schedule(room);
    }, delay);
    room.timer.unref?.();
  }
  function dropIfAbandoned(room) {
    clearTimeout(room.gc);
    if (room.members.some((m) => m.ws)) return;
    room.gc = setTimeout(() => {
      if (room.members.some((m) => m.ws)) return;
      clearTimeout(room.timer);
      rooms.delete(room.code);
    }, 10 * 60 * 1e3);
    room.gc.unref?.();
  }
  wss.on("connection", (ws) => {
    let room = null;
    let me = null;
    ws.alive = true;
    ws.on("pong", () => {
      ws.alive = true;
    });
    ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(String(raw));
      } catch {
        return send(ws, { type: "error", message: "\uC798\uBABB\uB41C \uBA54\uC2DC\uC9C0" });
      }
      try {
        if (msg.type === "join") {
          const code = String(msg.room ?? "").trim().toUpperCase().slice(0, 12);
          const name2 = String(msg.name ?? "").trim().slice(0, 12);
          if (!code || !name2) throw new RuleError("\uBC29 \uCF54\uB4DC\uC640 \uC774\uB984\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
          let r = rooms.get(code);
          const existing = msg.token && r ? r.members.find((m) => m.token === msg.token && !m.bot) : void 0;
          if (!r) {
            r = { code, members: [], game: null };
            rooms.set(code, r);
          }
          if (existing) {
            existing.ws?.close();
            existing.ws = ws;
            me = existing;
          } else {
            if (r.game) throw new RuleError("\uC774\uBBF8 \uC2DC\uC791\uB41C \uAC8C\uC784\uC785\uB2C8\uB2E4");
            if (r.members.length >= MAX_PLAYERS) throw new RuleError("\uBC29\uC774 \uAC00\uB4DD \uCC3C\uC2B5\uB2C8\uB2E4");
            if (r.members.some((m) => m.name === name2)) throw new RuleError("\uAC19\uC740 \uC774\uB984\uC774 \uC774\uBBF8 \uC788\uC2B5\uB2C8\uB2E4");
            me = { id: (0, import_node_crypto.randomUUID)().slice(0, 8), name: name2, token: (0, import_node_crypto.randomUUID)(), ws };
            r.members.push(me);
          }
          room = r;
          clearTimeout(r.gc);
          send(ws, { type: "joined", token: me.token, you: me.id, room: r.code });
          broadcast(r);
          schedule(r);
          return;
        }
        if (!room || !me) throw new RuleError("\uBA3C\uC800 \uBC29\uC5D0 \uC785\uC7A5\uD558\uC138\uC694");
        const isHost = hostOf(room)?.id === me.id;
        if (msg.type === "addBot" || msg.type === "removeBot") {
          if (room.game) throw new RuleError("\uAC8C\uC784 \uC911\uC5D0\uB294 \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4");
          if (!isHost) throw new RuleError("\uBC29\uC7A5\uB9CC \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
          if (msg.type === "addBot") {
            if (room.members.length >= MAX_PLAYERS) throw new RuleError("\uBC29\uC774 \uAC00\uB4DD \uCC3C\uC2B5\uB2C8\uB2E4");
            let n = 1;
            while (room.members.some((m) => m.name === `\uBD07${n}`)) n++;
            room.members.push({ id: `bot${(0, import_node_crypto.randomUUID)().slice(0, 5)}`, name: `\uBD07${n}`, token: "", ws: null, bot: true });
          } else room.members = room.members.filter((m) => !(m.bot && m.id === msg.id));
          return broadcast(room);
        }
        if (msg.type === "start") {
          if (room.game) throw new RuleError("\uC774\uBBF8 \uC2DC\uC791\uB418\uC5C8\uC2B5\uB2C8\uB2E4");
          if (!isHost) throw new RuleError("\uBC29\uC7A5\uB9CC \uC2DC\uC791\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
          if (room.members.length < 4) throw new RuleError("\uCD5C\uC18C 4\uBA85\uC774 \uD544\uC694\uD569\uB2C8\uB2E4 (\uBD07\uC744 \uCD94\uAC00\uD560 \uC218 \uC788\uC5B4\uC694)");
          room.game = createGame(room.members.map((m) => ({ id: m.id, name: m.name })));
          broadcast(room);
          schedule(room);
          return;
        }
        if (msg.type === "reset") {
          if (!isHost) throw new RuleError("\uBC29\uC7A5\uB9CC \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
          if (!room.game?.winner) throw new RuleError("\uAC8C\uC784\uC774 \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4");
          clearTimeout(room.timer);
          room.game = null;
          room.members = room.members.filter((m) => m.bot || m.ws);
          return broadcast(room);
        }
        if (msg.type === "action") {
          if (!room.game) throw new RuleError("\uAC8C\uC784\uC774 \uC2DC\uC791\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
          apply(room.game, me.id, msg.action);
          broadcast(room);
          schedule(room);
          return;
        }
        throw new RuleError("\uC54C \uC218 \uC5C6\uB294 \uBA54\uC2DC\uC9C0");
      } catch (e) {
        if (e instanceof RuleError) send(ws, { type: "error", message: e.message });
        else {
          console.error(e);
          send(ws, { type: "error", message: "\uC11C\uBC84 \uC624\uB958" });
        }
      }
    });
    ws.on("close", () => {
      if (!room || !me) return;
      if (me.ws === ws) me.ws = null;
      else return;
      if (!room.game) {
        room.members = room.members.filter((m) => m !== me);
        if (!room.members.some((m) => !m.bot)) {
          clearTimeout(room.timer);
          rooms.delete(room.code);
        } else broadcast(room);
      } else {
        broadcast(room);
        schedule(room);
        dropIfAbandoned(room);
      }
    });
  });
  const beat = setInterval(() => {
    for (const c of wss.clients) {
      if (c.alive === false) {
        c.terminate();
        continue;
      }
      c.alive = false;
      c.ping();
    }
  }, 25e3);
  return {
    wss,
    http,
    rooms,
    listening,
    close: () => new Promise((res) => {
      clearInterval(beat);
      for (const r of rooms.values()) {
        clearTimeout(r.timer);
        clearTimeout(r.gc);
      }
      for (const c of wss.clients) c.terminate();
      wss.close(() => http.close(() => res()));
    })
  };
}
if ("file:///bundled" === `file://${process.argv[1]}`) {
  const port2 = Number(process.env.PORT ?? 8080);
  const file = ["public/index.html", "dist/preview.html"].find((f) => (0, import_node_fs.existsSync)(new URL(`../${f}`, "file:///bundled")));
  const html = file ? (0, import_node_fs.readFileSync)(new URL(`../${file}`, "file:///bundled"), "utf8").replace("window.__IMG=", "window.__SERVED=1;window.__IMG=") : void 0;
  if (!html) console.warn("public/index.html \uC774 \uC5C6\uC5B4 \uD654\uBA74 \uC5C6\uC774 \uC6F9\uC18C\uCF13\uB9CC \uC5F4\uB9BD\uB2C8\uB2E4 (npm run build)");
  createBangServer(port2, { html });
  console.log(`\uBC45! \uC11C\uBC84 \uC2DC\uC791: ws://localhost:${port2}`);
}

// deploy/entry.ts
var port = Number(process.env.PORT ?? 8080);
createBangServer(port, { html: String(public_default).replace("window.__IMG=", "window.__SERVED=1;window.__IMG=") });
console.log(`\uBC45! \uC11C\uBC84 \uC2DC\uC791: http://localhost:${port}`);
