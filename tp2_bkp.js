// Ce programme a été généré automatiquement par le compilateur
// Gambit.  Il n'est pas destiné à être lu par des programmeurs mais
// si vous êtes curieux vous pouvez analyser ce code pour tenter de
// voir comment il fonctionne.

// Pour le TP2 de IFT1015, vous devez écrire votre propre code
// JavaScript qui a le même comportement mais qui est maintenable par
// une équipe de programmeurs (donc il doit être lisible, contenir des
// commentaires, des identificateurs bien choisis, utiliser des
// bons algorithmes, etc).

var gambit_r0;
var gambit_r1;
var gambit_r2;
var gambit_r3;
var gambit_r4;
var gambit_prm = {};
var gambit_glo = {};
var gambit_stack = [];
var gambit_sp = -1;
var gambit_nargs;
var gambit_temp1;
var gambit_temp2;
var gambit_pollcount = 100;
var gambit_current_thread;

function gambit_heapify(ra) {
  if (gambit_sp > 0) {
    var fs = ra.fs;
    var link = ra.link;
    var base = gambit_sp - fs;
    var chain = gambit_stack;
    if (base > 0) {
      chain = gambit_stack.slice(base,base + fs + 1);
      chain[0] = ra;
      gambit_sp = base;
      var prev_frame = chain;
      var prev_link = link;
      ra = prev_frame[prev_link];
      fs = ra.fs;
      link = ra.link;
      base = gambit_sp - fs;
      while (base > 0) {
        var frame = gambit_stack.slice(base,base + fs + 1);
        frame[0] = ra;
        gambit_sp = base;
        prev_frame[prev_link] = frame;
        prev_frame = frame;
        prev_link = link;
        ra = prev_frame[prev_link];
        fs = ra.fs;
        link = ra.link;
        base = gambit_sp - fs;
      }
      gambit_stack[link] = gambit_stack[0];
      gambit_stack[0] = ra;
      gambit_stack.length = fs + 1;
      prev_frame[prev_link] = gambit_stack;
    } else {
      chain[link] = chain[0];
      chain[0] = ra;
    }
    gambit_stack = [chain];
    gambit_sp = 0;
  }
  return gambit_underflow;
}

function gambit_underflow() {
  var frame = gambit_stack[0];
  if (frame === false) {
    return false;
  }
  var ra = frame[0];
  var fs = ra.fs;
  var link = ra.link;
  gambit_stack = frame.slice(0,fs + 1);
  gambit_sp = fs;
  gambit_stack[0] = frame[link];
  gambit_stack[link] = gambit_underflow;
  return ra;
}

gambit_underflow.fs = 0;

function gambit_str2codes(str) {
  
      var codes = [];
      for (var i=0; i < str.length; i++) {
          codes.push(str.charCodeAt(i));
      }
      return codes;
}

function Gambit_String(codes) {
  this.codes = codes;
}

Gambit_String.prototype.toString = function () {
  var limit = 32768;
  if (this.codes.length < limit) {
    return String.fromCharCode.apply(null,this.codes);
  } else {
    var chunks = [];
    var i = 0;
    while (i < this.codes.length) {
      chunks.push(String.fromCharCode.apply(null,this.codes.slice(i,i + limit)));
      (i += limit);
    }
    return chunks.join("");
  }
};

function Gambit_Flonum(val) {
  this.val = val;
}

function Gambit_Pair(car,cdr) {
  this.car = car;
  this.cdr = cdr;
}

function Gambit_Cpxnum(real,imag) {
  this.real = real;
  this.imag = imag;
}

function Gambit_Ratnum(num,den) {
  this.num = num;
  this.den = den;
}

function Gambit_Bignum(digits) {
  this.digits = digits;
}

function Gambit_Frame(slots) {
  this.slots = slots;
}

function Gambit_Continuation(frame,denv) {
  this.frame = frame;
  this.denv = denv;
}

function gambit_js2scm(obj) {
  if (obj === void 0) {
    return obj;
  } else if (typeof obj === "boolean") {
    return obj;
  } else if (obj === null) {
    return obj;
  } else if (typeof obj === "number") {
    if ((obj|0) === obj && obj>=-536870912 && obj<=536870911)
      return obj
    else
      return new Gambit_Flonum(obj);
  } else if (typeof obj === "function") {
    return function () { return gambit_scm2js_call(obj); };
  } else if (typeof obj === "string") {
    return new Gambit_String(gambit_str2codes(obj));
  } else if (typeof obj === "object") {
    if (obj instanceof Array) {
      return obj.map(gambit_js2scm);
    } else {
      var alist = null;
      for (var key in obj) {
        alist = new Gambit_Pair(new Gambit_Pair(gambit_js2scm(key),
                                                gambit_js2scm(obj[key])),
                                alist);
      }
      return alist;
    }
  } else {
    throw "gambit_js2scm error " + obj;
  }
}

function gambit_scm2js(obj) {
  if (obj === void 0) {
    return obj;
  } else if (typeof obj === "boolean") {
    return obj;
  } else if (obj === null) {
    return obj;
  } else if (typeof obj === "number") {
    return obj
  } else if (typeof obj === "function") {
    return function () { return gambit_js2scm_call(obj, arguments); };
  } else if (typeof obj === "object") {
    if (obj instanceof Array) {
      return obj.map(gambit_scm2js);
    } else if (obj instanceof Gambit_String) {
      return obj.toString();
    } else if (obj instanceof Gambit_Flonum) {
      return obj.val;
    } else if (obj instanceof Gambit_Pair) {
      var jsobj = {};
      var i = 0;
      while (obj instanceof Gambit_Pair) {
        var elem = obj.car;
        if (elem instanceof Gambit_Pair) {
          jsobj[gambit_scm2js(elem.car)] = gambit_scm2js(elem.cdr);
        } else {
          jsobj[i] = gambit_scm2js(elem);
        }
        ++i;
        obj = obj.cdr;
      }
      return jsobj;
    } else if (obj instanceof Gambit_Structure) {
      throw "gambit_scm2js error (can't convert Structure)";
    } else if (obj instanceof Gambit_Frame) {
      throw "gambit_scm2js error (can't convert Frame)";
    } else {
      throw "gambit_scm2js error " + obj;
    }
  } else {
    throw "gambit_scm2js error " + obj;
  }
}

function gambit_scm2js_call(fn) {

  if (gambit_nargs > 0) {
    gambit_stack[++gambit_sp] = gambit_r1;
    if (gambit_nargs > 1) {
      gambit_stack[++gambit_sp] = gambit_r2;
      if (gambit_nargs > 2) {
        gambit_stack[++gambit_sp] = gambit_r3;
      }
    }
  }

  var args = gambit_stack.slice(gambit_sp+1-gambit_nargs, gambit_sp+1);

  gambit_sp -= gambit_nargs;

  var ra = gambit_heapify(gambit_r0);
  var frame = gambit_stack[0];

  gambit_r1 = gambit_js2scm(fn.apply(null, args.map(gambit_scm2js)));

  gambit_sp = -1;
  gambit_stack[++gambit_sp] = frame;

  return ra;
}

function gambit_js2scm_call(proc, args) {

  var ra = function () { return false; };

  ra.id = 'gambit_js2scm_call';
  ra.fs = 1;
  ra.link = 1;

  gambit_sp = -1;
  gambit_stack[++gambit_sp] = [ra,false];

  gambit_nargs = args.length;

  for (var i=0; i<gambit_nargs; i++) {
    gambit_stack[++gambit_sp] = gambit_js2scm(args[i]);
  }

  if (gambit_nargs > 0) {
    if (gambit_nargs > 1) {
      if (gambit_nargs > 2) {
        gambit_r3 = gambit_stack[gambit_sp];
        --gambit_sp;
      }
      gambit_r2 = gambit_stack[gambit_sp];
      --gambit_sp;
    }
    gambit_r1 = gambit_stack[gambit_sp];
    --gambit_sp;
  }

  gambit_r0 = ra;

  gambit_trampoline(proc);

  return gambit_scm2js(gambit_r1);
}

function gambit_intlength(n) {
  if (n < 0) {
    n = ~ n;
  }
  n = n | (n >> 1);
  n = n | (n >> 2);
  n = n | (n >> 4);
  n = n | (n >> 8);
  n = n | (n >> 16);
  return gambit_bitcount(n);
}

function gambit_bignum_make(n,x,complement) {
  var i = 0;
  var digits = new Array(n);
  var nbdig = x === false ? 0 : x.digits.length;
  var flip = complement ? 16383 : 0;
  if (n < nbdig) {
    nbdig = n;
  }
  while (i < nbdig) {
    digits[i] = x.digits[i] ^ flip;
    ++i;
  }
  if (!(x === false) && x.digits[i - 1] > 8191) {
    flip = flip ^ 16383;
  }
  while (i < n) {
    digits[i] = flip;
    ++i;
  }
  return new Gambit_Bignum(digits);
}

function gambit_int2bignum(n) {
  var nbdig = ((gambit_intlength(n) / 14) | 0) + 1;
  var digits = new Array(nbdig);
  var i = 0;
  while (i < nbdig) {
    digits[i] = n & 16383;
    n = n >> 14;
    ++i;
  }
  return new Gambit_Bignum(digits);
}

function gambit_bitcount(n) {
  n = (n & 1431655765) + ((n >> 1) & 1431655765);
  n = (n & 858993459) + ((n >> 2) & 858993459);
  n = (n + (n >> 4)) & 252645135;
  n = n + (n >> 8);
  n = n + (n >> 16);
  return n & 255;
}

function gambit_trampoline(pc) {
  while (pc !== false) {
    pc = pc();
  }
}

function Gambit_Box(val) {
  this.val = val;
}

function gambit_build_rest(nrp) {
  var rest = null;
  if (gambit_nargs < nrp) {
    return false;
  }
  if (gambit_nargs > 0) {
    gambit_stack[++gambit_sp] = gambit_r1;
    if (gambit_nargs > 1) {
      gambit_stack[++gambit_sp] = gambit_r2;
      if (gambit_nargs > 2) {
        gambit_stack[++gambit_sp] = gambit_r3;
      }
    }
  }
  while (gambit_nargs > nrp) {
    rest = new Gambit_Pair(gambit_stack[gambit_sp],rest);
    --gambit_sp;
    --gambit_nargs;
  }
  gambit_stack[++gambit_sp] = rest;
  if (gambit_nargs > 0) {
    if (gambit_nargs > 1) {
      gambit_r3 = gambit_stack[gambit_sp];
      --gambit_sp;
    }
    gambit_r2 = gambit_stack[gambit_sp];
    --gambit_sp;
  }
  gambit_r1 = gambit_stack[gambit_sp];
  --gambit_sp;
  return true;
}

function gambit_poll(dest) {
  gambit_pollcount = 100;
  return dest;
}

function gambit_make_vector(len,init) {
  var elems = new Array(len);
  
            for (var i=0; i<len; i++) {
              elems[i] = init;
            }
            return elems;
}

function gambit_make_string(len,init) {
  var elems = new Array(len);
  
            for (var i=0; i<len; i++) {
              elems[i] = init;
            }
            return new Gambit_String(elems);
}

function Gambit_Structure(slots) {
  this.slots = slots;
  if (!this.slots[0]) {
    this.slots[0] = this;
  }
}

var gambit_char_table = {};

function gambit_make_interned_char(code) {
  var chr = gambit_char_table.hasOwnProperty(code) ? gambit_char_table[code] : false;
  if (!chr) {
    chr = new Gambit_Char(code);
    gambit_char_table[code] = chr;
  }
  return chr;
}

function gambit_closure_alloc(slots) {
  function closure(msg) {
    if (msg === true) {
      return slots;
    }
    gambit_r4 = closure;
    return slots[0];
  }
  return closure;
}

function gambit_wrong_nargs(proc) {
  gambit_build_rest(0);
  gambit_r2 = gambit_r1;
  gambit_r1 = proc;
  gambit_nargs = 2;
  return gambit_glo["##raise-wrong-number-of-arguments-exception"];
}

function Gambit_Char(code) {
  this.code = code;
}

Gambit_Char.prototype.toString = function () {
  return String.fromCharCode(this.code);
};

var gambit_cst__20_ps = [];


function js_alert(text) {
    alert(text);
}

var js_global_obj = this;

function js_set_global(name, val) {
    js_global_obj[name] = val;
}

function js_set_innerHTML(id, html) {
    document.getElementById(id).innerHTML = html;
}

function js_set_style(id, attr, val) {
    document.getElementById(id).style[attr] = val;
}

function js_setTimeout(thunk, timeout) {
    setTimeout(thunk, timeout);
}

gambit_cst__20_ps[0] = new Gambit_String([105,110,105,116]);
gambit_cst__20_ps[1] = new Gambit_String([101,109,112,116,121]);
gambit_cst__20_ps[2] = new Gambit_String([98,97,99,107]);
gambit_cst__20_ps[3] = new Gambit_String([99,108,105,99]);
gambit_cst__20_ps[4] = new Gambit_String([110,111,116,32,97,32,115,116,114,105,110,103]);
gambit_cst__20_ps[5] = new Gambit_String([108,105,115,116,32,101,120,112,101,99,116,101,100]);
gambit_cst__20_ps[6] = new Gambit_String([34,62,60,47,116,100,62,10]);
gambit_cst__20_ps[7] = new Gambit_String([84]);
gambit_cst__20_ps[8] = new Gambit_String([60,116,100,32,105,100,61,34]);
gambit_cst__20_ps[9] = new Gambit_String([116,114,97,110,115,112,97,114,101,110,116]);
gambit_cst__20_ps[10] = new Gambit_String([98,97,99,107,103,114,111,117,110,100,67,111,108,111,114]);
gambit_cst__20_ps[11] = new Gambit_String([46,115,118,103]);
gambit_cst__20_ps[12] = new Gambit_String([99,97,114,100,115,47]);
gambit_cst__20_ps[26] = [new Gambit_String([65]),new Gambit_String([50]),new Gambit_String([51]),new Gambit_String([52]),new Gambit_String([53]),new Gambit_String([54]),new Gambit_String([55]),new Gambit_String([56]),new Gambit_String([57]),new Gambit_String([49,48]),new Gambit_String([74]),new Gambit_String([81]),new Gambit_String([75])];
gambit_cst__20_ps[31] = [new Gambit_String([67]),new Gambit_String([68]),new Gambit_String([72]),new Gambit_String([83])];
gambit_cst__20_ps[32] = new Gambit_String([67]);
gambit_cst__20_ps[33] = new Gambit_String([82]);
gambit_cst__20_ps[34] = new Gambit_String([60,116,100,32,105,100,61,34]);
gambit_cst__20_ps[35] = new Gambit_String([41,59,34,62,60,47,116,100,62,10]);
gambit_cst__20_ps[36] = new Gambit_String([34,32,111,110,99,108,105,99,107,61,34,99,108,105,99,40]);
gambit_cst__20_ps[37] = new Gambit_String([60,116,100,62,60,98,117,116,116,111,110,32,111,110,99,108,105,99,107,61,34,105,110,105,116,40,41,59,34,32,115,116,121,108,101,32,61,32,34,102,108,111,97,116,58,32,108,101,102,116,59,34,62,78,111,117,118,101,108,108,101,32,112,97,114,116,105,101,60,47,98,117,116,116,111,110,62,60,47,116,100,62,10]);
gambit_cst__20_ps[38] = new Gambit_String([60,116,100,32,105,100,61,34]);
gambit_cst__20_ps[39] = new Gambit_String([60,116,100,62,60,47,116,100,62,10]);
gambit_cst__20_ps[40] = new Gambit_String([108,105,109,101]);
gambit_cst__20_ps[41] = new Gambit_String([98,97,99,107,103,114,111,117,110,100,67,111,108,111,114]);
gambit_cst__20_ps[42] = new Gambit_String([34,62]);
gambit_cst__20_ps[43] = new Gambit_String([60,105,109,103,32,115,114,99,61,34]);
gambit_cst__20_ps[44] = new Gambit_String([101,114,114,111,114]);
gambit_cst__20_ps[45] = new Gambit_String([98]);
gambit_cst__20_ps[46] = new Gambit_String([116,111,111,32,108,111,110,103]);
gambit_cst__20_ps[47] = new Gambit_String([84]);
gambit_cst__20_ps[48] = gambit_make_interned_char(45);
gambit_cst__20_ps[49] = new Gambit_String([41,59,34,62,60,47,116,100,62,10]);
gambit_cst__20_ps[50] = new Gambit_String([34,32,111,110,99,108,105,99,107,61,34,99,108,105,99,40]);
gambit_cst__20_ps[51] = new Gambit_String([60,47,116,97,98,108,101,62,10]);
gambit_cst__20_ps[52] = new Gambit_String([60,116,97,98,108,101,62,10]);
gambit_cst__20_ps[53] = new Gambit_String([86,111,116,114,101,32,112,111,105,110,116,97,103,101,32,102,105,110,97,108,32,101,115,116,32]);
gambit_cst__20_ps[54] = new Gambit_String([60,47,116,114,62,10]);
gambit_cst__20_ps[55] = new Gambit_String([60,116,114,62,10]);
gambit_cst__20_ps[56] = new Gambit_String([82]);
gambit_cst__20_ps[57] = new Gambit_String([]);
gambit_cst__20_ps[58] = new Gambit_String([48]);
gambit_cst__20_ps[59] = new Gambit_String([84]);
gambit_cst__20_ps[60] = new Gambit_String([82]);
gambit_cst__20_ps[61] = new Gambit_String([67]);
gambit_cst__20_ps[62] = new Gambit_String([67]);

// -------------------------------- primitive | ps| =

function gambit_bb1__20_ps() { // entry-point
  if (gambit_nargs !== 0) {
    return gambit_wrong_nargs(gambit_bb1__20_ps);
  }
  gambit_r1 = gambit_js2scm(js_alert);
  gambit_r2 = gambit_js2scm(js_set_global);
  gambit_r3 = gambit_js2scm(js_set_innerHTML);
  gambit_r4 = gambit_js2scm(js_set_style);
  gambit_stack[gambit_sp+1] = gambit_js2scm(js_setTimeout);
  gambit_stack[gambit_sp+2] = new Gambit_Box(false);
  gambit_stack[gambit_sp+3] = new Gambit_Box(false);
  gambit_stack[gambit_sp+4] = new Gambit_Box(false);
  gambit_stack[gambit_sp+5] = new Gambit_Box(false);
  gambit_stack[gambit_sp+6] = new Gambit_Box(1285);
  var closure0 = gambit_closure_alloc([gambit_bb445__20_ps,gambit_r1]);
  gambit_stack[gambit_sp+7] = closure0;
  var closure1 = gambit_closure_alloc([gambit_bb306__20_ps,gambit_stack[gambit_sp+7],gambit_r1,gambit_stack[gambit_sp+2],gambit_stack[gambit_sp+4],gambit_stack[gambit_sp+3],gambit_stack[gambit_sp+6],gambit_stack[gambit_sp+5],gambit_r3]);
  gambit_stack[gambit_sp+8] = closure1;
  var closure2 = gambit_closure_alloc([gambit_bb5__20_ps,gambit_stack[gambit_sp+7],gambit_r1,gambit_stack[gambit_sp+2],gambit_stack[gambit_sp+4],gambit_stack[gambit_sp+3],gambit_stack[gambit_sp+8],gambit_stack[gambit_sp+5],gambit_r3,gambit_r4,gambit_stack[gambit_sp+1]]);
  gambit_stack[gambit_sp+9] = closure2;
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r2;
  gambit_r2 = gambit_stack[gambit_sp+8];
  gambit_r1 = gambit_cst__20_ps[0];
  gambit_r0 = gambit_bb3__20_ps;
  (gambit_sp += 9);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb2__20_ps);
  } else {
    return gambit_bb2__20_ps();
  }
}

gambit_bb1__20_ps.id = 0;
gambit_bb1__20_ps.parent = false;
gambit_bb1__20_ps.nb_closed = -1;
gambit_bb1__20_ps.prm_name = " ps";
gambit_bb1__20_ps.subprocs = false;
gambit_bb1__20_ps.info = false;

function gambit_bb445__20_ps() { // closure-entry-point (+rest)
  if (gambit_nargs === 0) {
    gambit_r1 = null;
  } else {
    if (!gambit_build_rest(0)) {
      return gambit_wrong_nargs(gambit_r4);
    }
  }
  gambit_stack[gambit_sp+1] = gambit_r4(true)[1];
  gambit_stack[gambit_sp+2] = 0;
  gambit_r3 = 1;
  gambit_r2 = null;
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb448__20_ps);
  } else {
    return gambit_bb448__20_ps();
  }
}

gambit_bb445__20_ps.id = 1;
gambit_bb445__20_ps.parent = gambit_bb1__20_ps;
gambit_bb445__20_ps.nb_closed = 1;

function gambit_bb306__20_ps() { // closure-entry-point
  if (gambit_nargs !== 0) {
    return gambit_wrong_nargs(gambit_r4);
  }
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r4;
  gambit_stack[gambit_sp+3] = gambit_r4(true)[2];
  gambit_stack[gambit_sp+4] = gambit_r4(true)[1];
  var closure3 = gambit_closure_alloc([gambit_bb429__20_ps,gambit_r4(true)[1]]);
  gambit_stack[gambit_sp+5] = closure3;
  gambit_r3 = gambit_stack[gambit_sp+5];
  gambit_r2 = 6;
  gambit_r1 = 6;
  gambit_r0 = gambit_bb307__20_ps;
  (gambit_sp += 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb308__20_ps);
  } else {
    return gambit_bb308__20_ps();
  }
}

gambit_bb306__20_ps.id = 2;
gambit_bb306__20_ps.parent = gambit_bb1__20_ps;
gambit_bb306__20_ps.nb_closed = 8;

function gambit_bb5__20_ps() { // closure-entry-point
  if (gambit_nargs !== 1) {
    return gambit_wrong_nargs(gambit_r4);
  }
  gambit_r3 = gambit_r4(true)[7];
  gambit_r2 = gambit_r3.val;
  if (gambit_r2 === gambit_r1) {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r4;
    gambit_r2 = gambit_r4(true)[9];
    gambit_r1 = gambit_r4(true)[7];
    gambit_r3 = -1;
    gambit_r0 = gambit_bb305__20_ps;
    (gambit_sp += 2);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb12__20_ps);
    } else {
      return gambit_bb12__20_ps();
    }
  } else {
    if (25 === gambit_r1) {
      gambit_stack[gambit_sp+1] = gambit_r1;
      gambit_r3 = gambit_r4(true)[5];
      gambit_r2 = gambit_r3.val;
      gambit_r2 = gambit_r2[gambit_stack[gambit_sp+1]];
      if (gambit_r2 === 53) {
        ++gambit_sp;
        gambit_stack[gambit_sp] = gambit_r1;
        gambit_r3 = gambit_r4(true)[3];
        gambit_r2 = gambit_r3.val;
        gambit_r2 = gambit_r2.car;
        gambit_r3 = gambit_r4(true)[3];
        gambit_r3 = gambit_r3.val;
        gambit_r3 = gambit_r3.cdr;
        gambit_stack[gambit_sp+1] = gambit_r4(true)[3];
        gambit_stack[gambit_sp+1].val = gambit_r3;
        gambit_r3 = gambit_r4(true)[5];
        gambit_r3 = gambit_r3.val;
        gambit_r3[gambit_stack[gambit_sp]] = gambit_r2;
        gambit_stack[gambit_sp+1] = gambit_r0;
        gambit_stack[gambit_sp+2] = gambit_r1;
        gambit_stack[gambit_sp+3] = gambit_r4;
        if (gambit_r2 === 52) {
          (gambit_sp += 3);
          gambit_r2 = gambit_cst__20_ps[1];
          gambit_stack[gambit_sp] = gambit_r4;
          gambit_stack[gambit_sp-1] = gambit_r1;
          return gambit_bb26__20_ps();
        } else {
          (gambit_sp += 3);
          if (gambit_r2 === 53) {
            gambit_r1 = gambit_cst__20_ps[2];
            gambit_stack[gambit_sp] = gambit_r4;
            return gambit_bb25__20_ps();
          } else {
            gambit_stack[gambit_sp+1] = gambit_r2;
            gambit_r1 = gambit_r2;
            gambit_r0 = gambit_bb276__20_ps;
            ++gambit_sp;
            if (--gambit_pollcount === 0) {
              return gambit_poll(gambit_bb118__20_ps);
            } else {
              return gambit_bb118__20_ps();
            }
          }
        }
      } else {
        ++gambit_sp;
        return gambit_bb31__20_ps();
      }
    } else {
      gambit_r3 = gambit_r4(true)[7];
      gambit_r2 = gambit_r3.val;
      if (gambit_r2 === -1) {
        gambit_stack[gambit_sp+1] = gambit_r1;
        gambit_r3 = gambit_r4(true)[5];
        gambit_r2 = gambit_r3.val;
        gambit_r2 = gambit_r2[gambit_stack[gambit_sp+1]];
        if (gambit_r2 === 52) {
          ++gambit_sp;
          return gambit_bb35__20_ps();
        } else {
          ++gambit_sp;
          gambit_stack[gambit_sp] = gambit_r0;
          gambit_stack[gambit_sp+1] = gambit_r4;
          gambit_r3 = gambit_r1;
          gambit_r2 = gambit_r4(true)[9];
          gambit_r1 = gambit_r4(true)[7];
          gambit_r0 = gambit_bb279__20_ps;
          ++gambit_sp;
          if (--gambit_pollcount === 0) {
            return gambit_poll(gambit_bb12__20_ps);
          } else {
            return gambit_bb12__20_ps();
          }
        }
      } else {
        gambit_stack[gambit_sp+1] = gambit_r1;
        gambit_r3 = gambit_r4(true)[5];
        gambit_r2 = gambit_r3.val;
        gambit_r2 = gambit_r2[gambit_stack[gambit_sp+1]];
        if (gambit_r2 === 52) {
          ++gambit_sp;
          return gambit_bb280__20_ps();
        } else {
          ++gambit_sp;
          gambit_r3 = gambit_r4(true)[7];
          gambit_r3 = gambit_r3.val;
          if (gambit_r3 === 25) {
            gambit_stack[gambit_sp] = gambit_r0;
            gambit_stack[gambit_sp+1] = gambit_r4;
            gambit_r3 = gambit_r1;
            gambit_r2 = gambit_r4(true)[9];
            gambit_r1 = gambit_r4(true)[7];
            gambit_r0 = gambit_bb304__20_ps;
            ++gambit_sp;
            if (--gambit_pollcount === 0) {
              return gambit_poll(gambit_bb12__20_ps);
            } else {
              return gambit_bb12__20_ps();
            }
          } else {
            return gambit_bb280__20_ps();
          }
        }
      }
    }
  }
}

gambit_bb5__20_ps.id = 3;
gambit_bb5__20_ps.parent = gambit_bb1__20_ps;
gambit_bb5__20_ps.nb_closed = 10;

function gambit_bb3__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp];
  gambit_r1 = gambit_cst__20_ps[3];
  gambit_r0 = gambit_stack[gambit_sp-8];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb4__20_ps);
  } else {
    return gambit_bb4__20_ps();
  }
}

gambit_bb3__20_ps.id = 4;
gambit_bb3__20_ps.parent = gambit_bb1__20_ps;
gambit_bb3__20_ps.fs = 9;
gambit_bb3__20_ps.link = 1;

function gambit_bb2__20_ps() {
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-7]();
}

function gambit_bb448__20_ps() {
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r4 = gambit_r1.car;
    if (gambit_r4 instanceof Gambit_String) {
      gambit_stack[gambit_sp+1] = gambit_r4.codes.length;
      gambit_stack[gambit_sp] = gambit_stack[gambit_sp] + gambit_stack[gambit_sp+1];
      gambit_r2 = new Gambit_Pair(gambit_r4,gambit_r2);
      gambit_r3 = gambit_r3 + 1;
      gambit_r1 = gambit_r1.cdr;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb448__20_ps);
      } else {
        return gambit_bb448__20_ps();
      }
    } else {
      gambit_r1 = gambit_cst__20_ps[4];
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb475__20_ps);
      } else {
        return gambit_bb475__20_ps();
      }
    }
  } else {
    if (gambit_r1 === null) {
      gambit_r1 = gambit_make_string(gambit_stack[gambit_sp],0);
      gambit_r3 = gambit_r2;
      gambit_r2 = gambit_stack[gambit_sp];
      (gambit_sp -= 2);
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb451__20_ps);
      } else {
        return gambit_bb451__20_ps();
      }
    } else {
      gambit_r1 = gambit_cst__20_ps[5];
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb473__20_ps);
      } else {
        return gambit_bb473__20_ps();
      }
    }
  }
}

function gambit_bb429__20_ps() { // closure-entry-point
  if (gambit_nargs !== 2) {
    return gambit_wrong_nargs(gambit_r4);
  }
  if (gambit_r1 === 5) {
    if (gambit_r2 === 5) {
      gambit_r3 = gambit_cst__20_ps[6];
      gambit_r2 = gambit_cst__20_ps[7];
      gambit_r1 = gambit_cst__20_ps[8];
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb432__20_ps);
      } else {
        return gambit_bb432__20_ps();
      }
    } else {
      gambit_stack[gambit_sp+1] = gambit_r0;
      gambit_stack[gambit_sp+2] = gambit_r4;
      gambit_r1 = gambit_r2;
      gambit_r0 = gambit_bb434__20_ps;
      (gambit_sp += 2);
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb49__20_ps);
      } else {
        return gambit_bb49__20_ps();
      }
    }
  } else {
    if (gambit_r2 === 5) {
      gambit_stack[gambit_sp+1] = gambit_r0;
      gambit_stack[gambit_sp+2] = gambit_r4;
      gambit_r0 = gambit_bb439__20_ps;
      (gambit_sp += 2);
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb49__20_ps);
      } else {
        return gambit_bb49__20_ps();
      }
    } else {
      gambit_r1 = 5 * gambit_r1;
      gambit_r1 = gambit_r1 + gambit_r2;
      gambit_stack[gambit_sp+1] = gambit_r0;
      gambit_stack[gambit_sp+2] = gambit_r4;
      gambit_r0 = gambit_bb443__20_ps;
      (gambit_sp += 2);
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb49__20_ps);
      } else {
        return gambit_bb49__20_ps();
      }
    }
  }
}

gambit_bb429__20_ps.id = 5;
gambit_bb429__20_ps.parent = gambit_bb1__20_ps;
gambit_bb429__20_ps.nb_closed = 1;

function gambit_bb307__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp](true)[2];
  gambit_stack[gambit_sp+3] = gambit_stack[gambit_sp](true)[1];
  var closure4 = gambit_closure_alloc([gambit_bb421__20_ps,gambit_stack[gambit_sp](true)[1]]);
  gambit_stack[gambit_sp+4] = closure4;
  gambit_r3 = gambit_stack[gambit_sp+4];
  gambit_r2 = 4;
  gambit_r1 = 1;
  gambit_r0 = gambit_bb394__20_ps;
  (gambit_sp += 3);
  return gambit_bb308__20_ps();
}

gambit_bb307__20_ps.id = 6;
gambit_bb307__20_ps.parent = gambit_bb1__20_ps;
gambit_bb307__20_ps.fs = 2;
gambit_bb307__20_ps.link = 1;

function gambit_bb308__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp];
  gambit_stack[gambit_sp+2] = gambit_r0;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  gambit_r2 = gambit_r1;
  gambit_r1 = 0;
  gambit_r0 = gambit_bb309__20_ps;
  (gambit_sp += 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb36__20_ps);
  } else {
    return gambit_bb36__20_ps();
  }
}

function gambit_bb305__20_ps() { // return-point
  gambit_r4 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_stack[gambit_sp-1];
  --gambit_sp;
  return gambit_bb35__20_ps();
}

gambit_bb305__20_ps.id = 7;
gambit_bb305__20_ps.parent = gambit_bb1__20_ps;
gambit_bb305__20_ps.fs = 2;
gambit_bb305__20_ps.link = 1;

function gambit_bb12__20_ps() {
  gambit_r4 = gambit_r1.val;
  if (gambit_r4 === -1) {
    return gambit_bb13__20_ps();
  } else {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r1;
    gambit_stack[gambit_sp+3] = gambit_r2;
    gambit_stack[gambit_sp+4] = gambit_r3;
    gambit_r1 = gambit_r1.val;
    gambit_r3 = gambit_cst__20_ps[9];
    gambit_r2 = gambit_cst__20_ps[10];
    gambit_r0 = gambit_bb20__20_ps;
    (gambit_sp += 4);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb19__20_ps);
    } else {
      return gambit_bb19__20_ps();
    }
  }
}

function gambit_bb26__20_ps() {
  gambit_r3 = gambit_cst__20_ps[11];
  gambit_r1 = gambit_cst__20_ps[12];
  gambit_r0 = gambit_bb28__20_ps;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb27__20_ps);
  } else {
    return gambit_bb27__20_ps();
  }
}

function gambit_bb25__20_ps() {
  gambit_r2 = gambit_r1;
  return gambit_bb26__20_ps();
}

function gambit_bb276__20_ps() { // return-point
  gambit_r1 = gambit_r1 - 1;
  gambit_r1 = gambit_cst__20_ps[26][gambit_r1];
  gambit_r2 = gambit_stack[gambit_sp] & 3;
  gambit_r2 = gambit_cst__20_ps[31][gambit_r2];
  gambit_r0 = gambit_bb24__20_ps;
  gambit_nargs = 2;
  --gambit_sp;
  return gambit_stack[gambit_sp](true)[1]();
}

gambit_bb276__20_ps.id = 8;
gambit_bb276__20_ps.parent = gambit_bb1__20_ps;
gambit_bb276__20_ps.fs = 5;
gambit_bb276__20_ps.link = 2;

function gambit_bb118__20_ps() {
  gambit_r1 = (gambit_r1 / 4) | 0;
  gambit_r1 = gambit_r1 + 1;
  return gambit_r0;
}

function gambit_bb31__20_ps() {
  gambit_stack[gambit_sp] = gambit_r0;
  gambit_stack[gambit_sp+1] = gambit_r4;
  gambit_r3 = gambit_r1;
  gambit_r2 = gambit_r4(true)[9];
  gambit_r1 = gambit_r4(true)[7];
  gambit_r0 = gambit_bb32__20_ps;
  ++gambit_sp;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb12__20_ps);
  } else {
    return gambit_bb12__20_ps();
  }
}

function gambit_bb35__20_ps() {
  gambit_r1 = new Gambit_Box(0);
  gambit_stack[gambit_sp] = gambit_r0;
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_stack[gambit_sp+2] = gambit_r4;
  gambit_r2 = 5;
  gambit_r1 = 0;
  gambit_r0 = gambit_bb80__20_ps;
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb36__20_ps);
  } else {
    return gambit_bb36__20_ps();
  }
}

function gambit_bb279__20_ps() { // return-point
  gambit_r4 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_stack[gambit_sp-1];
  --gambit_sp;
  return gambit_bb35__20_ps();
}

gambit_bb279__20_ps.id = 9;
gambit_bb279__20_ps.parent = gambit_bb1__20_ps;
gambit_bb279__20_ps.fs = 2;
gambit_bb279__20_ps.link = 1;

function gambit_bb280__20_ps() {
  gambit_stack[gambit_sp] = gambit_r0;
  gambit_stack[gambit_sp+1] = gambit_r2;
  gambit_stack[gambit_sp+2] = gambit_r4;
  gambit_stack[gambit_sp+3] = gambit_r4(true)[5];
  gambit_stack[gambit_sp+4] = gambit_r4(true)[8];
  gambit_r0 = gambit_r4(true)[7];
  gambit_r2 = gambit_r0.val;
  gambit_r0 = gambit_r4(true)[5];
  gambit_r3 = gambit_r0.val;
  gambit_r3 = gambit_r3[gambit_r2];
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_r4(true)[1];
  gambit_r0 = gambit_bb295__20_ps;
  (gambit_sp += 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb282__20_ps);
  } else {
    return gambit_bb282__20_ps();
  }
}

function gambit_bb304__20_ps() { // return-point
  return gambit_bb34__20_ps();
}

gambit_bb304__20_ps.id = 10;
gambit_bb304__20_ps.parent = gambit_bb1__20_ps;
gambit_bb304__20_ps.fs = 2;
gambit_bb304__20_ps.link = 1;

function gambit_bb4__20_ps() {
  gambit_nargs = 2;
  (gambit_sp -= 9);
  return gambit_stack[gambit_sp+2]();
}

function gambit_bb475__20_ps() {
  gambit_nargs = 1;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb451__20_ps() {
  if (gambit_r3 instanceof Gambit_Pair) {
    gambit_r4 = gambit_r3.car;
    gambit_stack[gambit_sp+1] = gambit_r4.codes.length;
    gambit_r2 = gambit_r2 - gambit_stack[gambit_sp+1];
    if (0 < gambit_r2) {
      ++gambit_sp;
      gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp] - 1;
      gambit_stack[gambit_sp] = gambit_stack[gambit_sp] - 0;
      gambit_stack[gambit_sp] = gambit_r2 + gambit_stack[gambit_sp];
      gambit_stack[gambit_sp] = gambit_stack[gambit_sp] - 1;
      if (gambit_stack[gambit_sp+1] < 0) {
        ++gambit_sp;
        return gambit_bb454__20_ps();
      } else {
        ++gambit_sp;
        gambit_stack[gambit_sp+1] = gambit_make_interned_char(gambit_r4.codes[gambit_stack[gambit_sp]]);
        gambit_r1.codes[gambit_stack[gambit_sp-1]] = gambit_stack[gambit_sp+1].code;
        gambit_stack[gambit_sp] = gambit_stack[gambit_sp] - 1;
        gambit_stack[gambit_sp-1] = gambit_stack[gambit_sp-1] - 1;
        if (gambit_stack[gambit_sp] < 0) {
          ++gambit_sp;
          --gambit_sp;
          return gambit_bb454__20_ps();
        } else {
          ++gambit_sp;
          gambit_stack[gambit_sp] = gambit_make_interned_char(gambit_r4.codes[gambit_stack[gambit_sp-1]]);
          gambit_r1.codes[gambit_stack[gambit_sp-2]] = gambit_stack[gambit_sp].code;
          gambit_stack[gambit_sp] = gambit_r0;
          gambit_stack[gambit_sp+1] = gambit_r1;
          gambit_stack[gambit_sp+2] = gambit_r2;
          gambit_stack[gambit_sp+3] = gambit_r3;
          gambit_stack[gambit_sp+4] = gambit_r1;
          gambit_r3 = gambit_stack[gambit_sp-2] - 1;
          gambit_r2 = gambit_stack[gambit_sp-1] - 1;
          gambit_r1 = gambit_r4;
          gambit_r0 = gambit_bb463__20_ps;
          (gambit_sp += 4);
          if (--gambit_pollcount === 0) {
            return gambit_poll(gambit_bb460__20_ps);
          } else {
            return gambit_bb460__20_ps();
          }
        }
      }
    } else {
      ++gambit_sp;
      gambit_stack[gambit_sp+1] = gambit_r0;
      gambit_stack[gambit_sp+2] = gambit_r1;
      gambit_stack[gambit_sp+3] = gambit_r2;
      gambit_stack[gambit_sp+4] = gambit_r3;
      gambit_stack[gambit_sp+5] = gambit_r1;
      gambit_stack[gambit_sp+6] = gambit_r4;
      gambit_r3 = gambit_r2;
      gambit_r1 = gambit_stack[gambit_sp];
      gambit_r2 = 0;
      gambit_r0 = gambit_bb470__20_ps;
      (gambit_sp += 6);
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb467__20_ps);
      } else {
        return gambit_bb467__20_ps();
      }
    }
  } else {
    return gambit_r0;
  }
}

function gambit_bb473__20_ps() {
  gambit_nargs = 1;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb432__20_ps() {
  gambit_nargs = 3;
  return gambit_r4(true)[1]();
}

function gambit_bb434__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[32];
  gambit_r0 = gambit_bb435__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[1]();
}

gambit_bb434__20_ps.id = 11;
gambit_bb434__20_ps.parent = gambit_bb1__20_ps;
gambit_bb434__20_ps.fs = 2;
gambit_bb434__20_ps.link = 1;

function gambit_bb49__20_ps() {
  if (typeof gambit_r1 === "number") {
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    return gambit_bb62__20_ps();
  }
}

function gambit_bb439__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[33];
  gambit_r0 = gambit_bb440__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[1]();
}

gambit_bb439__20_ps.id = 12;
gambit_bb439__20_ps.parent = gambit_bb1__20_ps;
gambit_bb439__20_ps.fs = 2;
gambit_bb439__20_ps.link = 1;

function gambit_bb443__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-1];
  gambit_stack[gambit_sp-1] = gambit_cst__20_ps[34];
  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp];
  gambit_stack[gambit_sp] = gambit_r1;
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[35];
  gambit_r1 = gambit_cst__20_ps[36];
  gambit_r0 = gambit_stack[gambit_sp+1];
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb444__20_ps);
  } else {
    return gambit_bb444__20_ps();
  }
}

gambit_bb443__20_ps.id = 13;
gambit_bb443__20_ps.parent = gambit_bb1__20_ps;
gambit_bb443__20_ps.fs = 2;
gambit_bb443__20_ps.link = 1;

function gambit_bb421__20_ps() { // closure-entry-point
  if (gambit_nargs !== 2) {
    return gambit_wrong_nargs(gambit_r4);
  }
  if (gambit_r2 === 0) {
    gambit_r1 = gambit_cst__20_ps[37];
    return gambit_r0;
  } else {
    if (gambit_r2 === 2) {
      gambit_stack[gambit_sp+1] = gambit_cst__20_ps[38];
      gambit_stack[gambit_sp+2] = gambit_r0;
      gambit_stack[gambit_sp+3] = gambit_r4;
      gambit_r1 = 25;
      gambit_r0 = gambit_bb424__20_ps;
      (gambit_sp += 3);
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb49__20_ps);
      } else {
        return gambit_bb49__20_ps();
      }
    } else {
      gambit_r1 = gambit_cst__20_ps[39];
      return gambit_r0;
    }
  }
}

gambit_bb421__20_ps.id = 14;
gambit_bb421__20_ps.parent = gambit_bb1__20_ps;
gambit_bb421__20_ps.nb_closed = 1;

function gambit_bb394__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb395__20_ps;
  gambit_nargs = 2;
  --gambit_sp;
  return gambit_stack[gambit_sp](true)[1]();
}

gambit_bb394__20_ps.id = 15;
gambit_bb394__20_ps.parent = gambit_bb1__20_ps;
gambit_bb394__20_ps.fs = 3;
gambit_bb394__20_ps.link = 1;

function gambit_bb309__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-1];
  gambit_stack[gambit_sp-1] = gambit_stack[gambit_sp-5];
  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp];
  gambit_stack[gambit_sp] = gambit_stack[gambit_sp-4];
  gambit_r3 = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp+2];
  gambit_r1 = gambit_stack[gambit_sp+1];
  gambit_r0 = gambit_bb363__20_ps;
  if (gambit_r3 instanceof Gambit_Pair) {
    return gambit_bb311__20_ps();
  } else {
    return gambit_bb360__20_ps();
  }
}

gambit_bb309__20_ps.id = 16;
gambit_bb309__20_ps.parent = gambit_bb1__20_ps;
gambit_bb309__20_ps.fs = 6;
gambit_bb309__20_ps.link = 4;

function gambit_bb36__20_ps() {
  if (gambit_r1 < gambit_r2) {
    return gambit_bb37__20_ps();
  } else {
    return gambit_bb44__20_ps();
  }
}

function gambit_bb13__20_ps() {
  gambit_r1.val = gambit_r3;
  gambit_r3 = gambit_r1.val;
  if (gambit_r3 === -1) {
    gambit_r1 = undefined;
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb15__20_ps);
    } else {
      return gambit_bb15__20_ps();
    }
  } else {
    gambit_r1 = gambit_r1.val;
    gambit_r3 = gambit_cst__20_ps[40];
    gambit_stack[gambit_sp+1] = gambit_r2;
    gambit_r2 = gambit_cst__20_ps[41];
    ++gambit_sp;
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb17__20_ps);
    } else {
      return gambit_bb17__20_ps();
    }
  }
}

function gambit_bb20__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp];
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_stack[gambit_sp-3];
  (gambit_sp -= 4);
  return gambit_bb13__20_ps();
}

gambit_bb20__20_ps.id = 17;
gambit_bb20__20_ps.parent = gambit_bb1__20_ps;
gambit_bb20__20_ps.fs = 4;
gambit_bb20__20_ps.link = 1;

function gambit_bb19__20_ps() {
  gambit_nargs = 3;
  return gambit_stack[gambit_sp-1]();
}

function gambit_bb28__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[42];
  gambit_r1 = gambit_cst__20_ps[43];
  gambit_r0 = gambit_bb29__20_ps;
  gambit_nargs = 3;
  return gambit_stack[gambit_sp](true)[1]();
}

gambit_bb28__20_ps.id = 18;
gambit_bb28__20_ps.parent = gambit_bb1__20_ps;
gambit_bb28__20_ps.fs = 4;
gambit_bb28__20_ps.link = 2;

function gambit_bb27__20_ps() {
  gambit_nargs = 3;
  return gambit_stack[gambit_sp](true)[1]();
}

function gambit_bb24__20_ps() { // return-point
  return gambit_bb25__20_ps();
}

gambit_bb24__20_ps.id = 19;
gambit_bb24__20_ps.parent = gambit_bb1__20_ps;
gambit_bb24__20_ps.fs = 4;
gambit_bb24__20_ps.link = 2;

function gambit_bb32__20_ps() { // return-point
  gambit_r4 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_stack[gambit_sp-1];
  --gambit_sp;
  return gambit_bb35__20_ps();
}

gambit_bb32__20_ps.id = 20;
gambit_bb32__20_ps.parent = gambit_bb1__20_ps;
gambit_bb32__20_ps.fs = 2;
gambit_bb32__20_ps.link = 1;

function gambit_bb80__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp](true)[5];
  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp](true)[8];
  gambit_r3 = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp](true)[1];
  gambit_r0 = gambit_bb261__20_ps;
  if (gambit_r3 instanceof Gambit_Pair) {
    (gambit_sp += 2);
    return gambit_bb83__20_ps();
  } else {
    (gambit_sp += 2);
    return gambit_bb260__20_ps();
  }
}

gambit_bb80__20_ps.id = 21;
gambit_bb80__20_ps.parent = gambit_bb1__20_ps;
gambit_bb80__20_ps.fs = 3;
gambit_bb80__20_ps.link = 1;

function gambit_bb295__20_ps() { // return-point
  gambit_r0 = gambit_stack[gambit_sp](true)[7];
  gambit_r1 = gambit_r0.val;
  if (gambit_r1 === 25) {
    gambit_r0 = gambit_stack[gambit_sp](true)[4];
    gambit_r1 = gambit_r0.val;
    gambit_r1 = gambit_r1 - 1;
    gambit_r0 = gambit_stack[gambit_sp](true)[4];
    gambit_r0.val = gambit_r1;
    gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp](true)[5];
    gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp](true)[8];
    gambit_r0 = gambit_stack[gambit_sp](true)[4];
    gambit_r1 = gambit_r0.val;
    if (gambit_r1 === 0) {
      (gambit_sp += 2);
      gambit_r3 = 52;
      return gambit_bb299__20_ps();
    } else {
      (gambit_sp += 2);
      gambit_r3 = 53;
      return gambit_bb299__20_ps();
    }
  } else {
    gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp](true)[5];
    gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp](true)[8];
    gambit_r3 = gambit_stack[gambit_sp-1];
    gambit_r0 = gambit_stack[gambit_sp](true)[7];
    gambit_r2 = gambit_r0.val;
    gambit_r1 = gambit_stack[gambit_sp](true)[1];
    gambit_r0 = gambit_bb301__20_ps;
    (gambit_sp += 2);
    return gambit_bb282__20_ps();
  }
}

gambit_bb295__20_ps.id = 22;
gambit_bb295__20_ps.parent = gambit_bb1__20_ps;
gambit_bb295__20_ps.fs = 3;
gambit_bb295__20_ps.link = 1;

function gambit_bb282__20_ps() {
  gambit_r4 = gambit_stack[gambit_sp-1].val;
  gambit_r4[gambit_r2] = gambit_r3;
  gambit_stack[gambit_sp-1] = gambit_r0;
  gambit_stack[gambit_sp+1] = gambit_r2;
  gambit_stack[gambit_sp+2] = gambit_r1;
  if (gambit_r3 === 52) {
    (gambit_sp += 2);
    gambit_r2 = gambit_cst__20_ps[1];
    return gambit_bb284__20_ps();
  } else {
    (gambit_sp += 2);
    if (gambit_r3 === 53) {
      gambit_r1 = gambit_cst__20_ps[2];
      return gambit_bb292__20_ps();
    } else {
      gambit_stack[gambit_sp+1] = gambit_r3;
      gambit_r1 = gambit_r3;
      gambit_r0 = gambit_bb294__20_ps;
      ++gambit_sp;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb118__20_ps);
      } else {
        return gambit_bb118__20_ps();
      }
    }
  }
}

function gambit_bb34__20_ps() {
  gambit_r4 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_stack[gambit_sp-1];
  --gambit_sp;
  return gambit_bb35__20_ps();
}

function gambit_bb454__20_ps() {
  gambit_r3 = gambit_r3.cdr;
  (gambit_sp -= 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb451__20_ps);
  } else {
    return gambit_bb451__20_ps();
  }
}

function gambit_bb463__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp];
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_stack[gambit_sp-3];
  (gambit_sp -= 4);
  return gambit_bb454__20_ps();
}

gambit_bb463__20_ps.id = 23;
gambit_bb463__20_ps.parent = gambit_bb1__20_ps;
gambit_bb463__20_ps.fs = 6;
gambit_bb463__20_ps.link = 3;

function gambit_bb460__20_ps() {
  if (gambit_r2 < 0) {
    gambit_r1 = gambit_stack[gambit_sp];
    --gambit_sp;
    return gambit_r0;
  } else {
    gambit_r4 = gambit_make_interned_char(gambit_r1.codes[gambit_r2]);
    gambit_stack[gambit_sp].codes[gambit_r3] = gambit_r4.code;
    gambit_r2 = gambit_r2 - 1;
    gambit_r3 = gambit_r3 - 1;
    if (gambit_r2 < 0) {
      gambit_r1 = gambit_stack[gambit_sp];
      --gambit_sp;
      return gambit_r0;
    } else {
      gambit_r4 = gambit_make_interned_char(gambit_r1.codes[gambit_r2]);
      gambit_stack[gambit_sp].codes[gambit_r3] = gambit_r4.code;
      gambit_r3 = gambit_r3 - 1;
      gambit_r2 = gambit_r2 - 1;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb460__20_ps);
      } else {
        return gambit_bb460__20_ps();
      }
    }
  }
}

function gambit_bb470__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp];
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_stack[gambit_sp-3];
  (gambit_sp -= 3);
  return gambit_bb454__20_ps();
}

gambit_bb470__20_ps.id = 24;
gambit_bb470__20_ps.parent = gambit_bb1__20_ps;
gambit_bb470__20_ps.fs = 5;
gambit_bb470__20_ps.link = 2;

function gambit_bb467__20_ps() {
  if (gambit_r2 < gambit_r1) {
    gambit_r4 = gambit_make_interned_char(gambit_stack[gambit_sp].codes[gambit_r2]);
    gambit_stack[gambit_sp-1].codes[gambit_r3] = gambit_r4.code;
    gambit_r2 = gambit_r2 + 1;
    gambit_r3 = gambit_r3 + 1;
    if (gambit_r2 < gambit_r1) {
      gambit_r4 = gambit_make_interned_char(gambit_stack[gambit_sp].codes[gambit_r2]);
      gambit_stack[gambit_sp-1].codes[gambit_r3] = gambit_r4.code;
      gambit_r3 = gambit_r3 + 1;
      gambit_r2 = gambit_r2 + 1;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb467__20_ps);
      } else {
        return gambit_bb467__20_ps();
      }
    } else {
      gambit_r1 = gambit_stack[gambit_sp-1];
      (gambit_sp -= 2);
      return gambit_r0;
    }
  } else {
    gambit_r1 = gambit_stack[gambit_sp-1];
    (gambit_sp -= 2);
    return gambit_r0;
  }
}

function gambit_bb435__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[6];
  gambit_r1 = gambit_cst__20_ps[8];
  gambit_r0 = gambit_stack[gambit_sp-1];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb436__20_ps);
  } else {
    return gambit_bb436__20_ps();
  }
}

gambit_bb435__20_ps.id = 25;
gambit_bb435__20_ps.parent = gambit_bb1__20_ps;
gambit_bb435__20_ps.fs = 2;
gambit_bb435__20_ps.link = 1;

function gambit_bb51__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_r3 = gambit_r1;
  gambit_r2 = 1;
  gambit_r1 = 1;
  gambit_r0 = gambit_bb58__20_ps;
  ++gambit_sp;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb52__20_ps);
  } else {
    return gambit_bb52__20_ps();
  }
}

function gambit_bb60__20_ps() {
  gambit_r3 = - gambit_r1;
  gambit_r2 = 1;
  gambit_r1 = 0;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb52__20_ps);
  } else {
    return gambit_bb52__20_ps();
  }
}

function gambit_bb62__20_ps() {
  gambit_r1 = gambit_cst__20_ps[44];
  return gambit_r0;
}

function gambit_bb440__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[6];
  gambit_r1 = gambit_cst__20_ps[8];
  gambit_r0 = gambit_stack[gambit_sp-1];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb441__20_ps);
  } else {
    return gambit_bb441__20_ps();
  }
}

gambit_bb440__20_ps.id = 26;
gambit_bb440__20_ps.parent = gambit_bb1__20_ps;
gambit_bb440__20_ps.fs = 2;
gambit_bb440__20_ps.link = 1;

function gambit_bb444__20_ps() {
  gambit_nargs = 5;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+2](true)[1]();
}

function gambit_bb424__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-1];
  gambit_stack[gambit_sp-1] = gambit_r1;
  gambit_r1 = 25;
  gambit_r0 = gambit_bb425__20_ps;
  if (typeof gambit_r1 === "number") {
    ++gambit_sp;
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    ++gambit_sp;
    return gambit_bb62__20_ps();
  }
}

gambit_bb424__20_ps.id = 27;
gambit_bb424__20_ps.parent = gambit_bb1__20_ps;
gambit_bb424__20_ps.fs = 3;
gambit_bb424__20_ps.link = 2;

function gambit_bb395__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[45];
  gambit_r0 = gambit_bb396__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[8]();
}

gambit_bb395__20_ps.id = 28;
gambit_bb395__20_ps.parent = gambit_bb1__20_ps;
gambit_bb395__20_ps.fs = 2;
gambit_bb395__20_ps.link = 1;

function gambit_bb363__20_ps() { // return-point
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.cdr;
    if (gambit_r2 instanceof Gambit_Pair) {
      gambit_r3 = gambit_r2.cdr;
      if (gambit_r3 instanceof Gambit_Pair) {
        gambit_r4 = gambit_r3.cdr;
        if (gambit_r4 instanceof Gambit_Pair) {
          gambit_r0 = gambit_r4.cdr;
          if (gambit_r0 instanceof Gambit_Pair) {
            gambit_stack[gambit_sp+1] = gambit_r0.cdr;
            if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
              ++gambit_sp;
              gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp].cdr;
              if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
                ++gambit_sp;
                gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp].cdr;
                if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
                  ++gambit_sp;
                  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp].cdr;
                  if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
                    ++gambit_sp;
                    gambit_r1 = gambit_cst__20_ps[46];
                    gambit_r0 = gambit_bb374__20_ps;
                    gambit_nargs = 1;
                    (gambit_sp -= 4);
                    return gambit_stack[gambit_sp-3]();
                  } else {
                    ++gambit_sp;
                    gambit_r1 = gambit_r1.car;
                    gambit_stack[gambit_sp-7] = gambit_stack[gambit_sp-3];
                    gambit_stack[gambit_sp-3] = gambit_r1;
                    gambit_r1 = gambit_r2.car;
                    gambit_stack[gambit_sp] = gambit_stack[gambit_sp-2];
                    gambit_stack[gambit_sp-2] = gambit_r1;
                    gambit_r1 = gambit_r3.car;
                    gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-1];
                    gambit_stack[gambit_sp-1] = gambit_r1;
                    gambit_r1 = gambit_r4.car;
                    gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp];
                    gambit_stack[gambit_sp] = gambit_r1;
                    gambit_r1 = gambit_r0.car;
                    gambit_stack[gambit_sp+3] = gambit_stack[gambit_sp+1];
                    gambit_stack[gambit_sp+1] = gambit_r1;
                    gambit_r3 = gambit_stack[gambit_sp+3].car;
                    gambit_r2 = gambit_stack[gambit_sp+2].car;
                    gambit_r1 = gambit_stack[gambit_sp-7].car;
                    gambit_r0 = gambit_bb373__20_ps;
                    gambit_nargs = 8;
                    ++gambit_sp;
                    return gambit_stack[gambit_sp-6]();
                  }
                } else {
                  ++gambit_sp;
                  gambit_r1 = gambit_r1.car;
                  gambit_stack[gambit_sp-6] = gambit_stack[gambit_sp-2];
                  gambit_stack[gambit_sp-2] = gambit_r1;
                  gambit_r1 = gambit_r2.car;
                  gambit_stack[gambit_sp] = gambit_stack[gambit_sp-1];
                  gambit_stack[gambit_sp-1] = gambit_r1;
                  gambit_r1 = gambit_r3.car;
                  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp];
                  gambit_stack[gambit_sp] = gambit_r1;
                  gambit_r1 = gambit_r4.car;
                  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp+1];
                  gambit_stack[gambit_sp+1] = gambit_r1;
                  gambit_r3 = gambit_stack[gambit_sp+2].car;
                  gambit_r2 = gambit_stack[gambit_sp-6].car;
                  gambit_r1 = gambit_r0.car;
                  gambit_r0 = gambit_bb379__20_ps;
                  gambit_nargs = 7;
                  ++gambit_sp;
                  return gambit_stack[gambit_sp-5]();
                }
              } else {
                ++gambit_sp;
                gambit_r1 = gambit_r1.car;
                gambit_stack[gambit_sp-5] = gambit_stack[gambit_sp-1];
                gambit_stack[gambit_sp-1] = gambit_r1;
                gambit_stack[gambit_sp] = gambit_r2.car;
                gambit_stack[gambit_sp+1] = gambit_r3.car;
                gambit_r3 = gambit_stack[gambit_sp-5].car;
                gambit_r2 = gambit_r0.car;
                gambit_r1 = gambit_r4.car;
                gambit_r0 = gambit_bb381__20_ps;
                gambit_nargs = 6;
                ++gambit_sp;
                return gambit_stack[gambit_sp-4]();
              }
            } else {
              ++gambit_sp;
              gambit_stack[gambit_sp] = gambit_r1.car;
              gambit_stack[gambit_sp+1] = gambit_r2.car;
              gambit_r1 = gambit_r0.car;
              gambit_stack[gambit_sp-4] = gambit_r3;
              gambit_r3 = gambit_r1;
              gambit_r2 = gambit_r4.car;
              gambit_r1 = gambit_stack[gambit_sp-4].car;
              gambit_r0 = gambit_bb383__20_ps;
              gambit_nargs = 5;
              ++gambit_sp;
              return gambit_stack[gambit_sp-3]();
            }
          } else {
            gambit_stack[gambit_sp+1] = gambit_r1.car;
            gambit_r1 = gambit_r4.car;
            gambit_stack[gambit_sp-3] = gambit_r3;
            gambit_r3 = gambit_r1;
            gambit_r1 = gambit_stack[gambit_sp-3].car;
            gambit_stack[gambit_sp-3] = gambit_r2;
            gambit_r2 = gambit_r1;
            gambit_r1 = gambit_stack[gambit_sp-3].car;
            gambit_r0 = gambit_bb385__20_ps;
            gambit_nargs = 4;
            ++gambit_sp;
            return gambit_stack[gambit_sp-2]();
          }
        } else {
          gambit_r3 = gambit_r3.car;
          gambit_r2 = gambit_r2.car;
          gambit_r1 = gambit_r1.car;
          gambit_r0 = gambit_bb387__20_ps;
          gambit_nargs = 3;
          return gambit_stack[gambit_sp-1]();
        }
      } else {
        gambit_r2 = gambit_r2.car;
        gambit_r1 = gambit_r1.car;
        gambit_r0 = gambit_bb389__20_ps;
        gambit_nargs = 2;
        return gambit_stack[gambit_sp-1]();
      }
    } else {
      gambit_r1 = gambit_r1.car;
      gambit_r0 = gambit_bb391__20_ps;
      gambit_nargs = 1;
      return gambit_stack[gambit_sp-1]();
    }
  } else {
    gambit_r0 = gambit_bb393__20_ps;
    gambit_nargs = 0;
    return gambit_stack[gambit_sp-1]();
  }
}

gambit_bb363__20_ps.id = 29;
gambit_bb363__20_ps.parent = gambit_bb1__20_ps;
gambit_bb363__20_ps.fs = 4;
gambit_bb363__20_ps.link = 4;

function gambit_bb311__20_ps() {
  gambit_r4 = gambit_r3.car;
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  if (0 < gambit_r1) {
    (gambit_sp += 4);
    if (1 < gambit_r1) {
      gambit_stack[gambit_sp+1] = gambit_r4;
      gambit_r2 = gambit_r1;
      gambit_r1 = 2;
      gambit_r0 = gambit_bb314__20_ps;
      ++gambit_sp;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb36__20_ps);
      } else {
        return gambit_bb36__20_ps();
      }
    } else {
      gambit_r1 = null;
      gambit_stack[gambit_sp] = gambit_r3;
      gambit_stack[gambit_sp-1] = gambit_r2;
      return gambit_bb316__20_ps();
    }
  } else {
    (gambit_sp += 4);
    gambit_r1 = null;
    gambit_stack[gambit_sp] = gambit_r3;
    gambit_stack[gambit_sp-1] = gambit_r2;
    return gambit_bb317__20_ps();
  }
}

function gambit_bb360__20_ps() {
  gambit_r1 = null;
  (gambit_sp -= 2);
  return gambit_r0;
}

function gambit_bb37__20_ps() {
  gambit_r3 = gambit_r1 + 1;
  if (gambit_r3 < gambit_r2) {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r1;
    gambit_stack[gambit_sp+3] = gambit_r3;
    gambit_r1 = gambit_r3 + 1;
    gambit_r0 = gambit_bb39__20_ps;
    (gambit_sp += 3);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb36__20_ps);
    } else {
      return gambit_bb36__20_ps();
    }
  } else {
    gambit_stack[gambit_sp+1] = gambit_r1;
    gambit_r1 = null;
    ++gambit_sp;
    return gambit_bb41__20_ps();
  }
}

function gambit_bb44__20_ps() {
  gambit_r1 = null;
  return gambit_r0;
}

function gambit_bb15__20_ps() {
  return gambit_r0;
}

function gambit_bb17__20_ps() {
  gambit_nargs = 3;
  --gambit_sp;
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb29__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp-3];
  gambit_r0 = gambit_bb30__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[8]();
}

gambit_bb29__20_ps.id = 30;
gambit_bb29__20_ps.parent = gambit_bb1__20_ps;
gambit_bb29__20_ps.fs = 4;
gambit_bb29__20_ps.link = 2;

function gambit_bb261__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp-1].val;
  gambit_r1 = gambit_cst__20_ps[47];
  gambit_r0 = gambit_bb262__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[8]();
}

gambit_bb261__20_ps.id = 31;
gambit_bb261__20_ps.parent = gambit_bb1__20_ps;
gambit_bb261__20_ps.fs = 3;
gambit_bb261__20_ps.link = 1;

function gambit_bb83__20_ps() {
  gambit_r4 = gambit_r3.car;
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  gambit_stack[gambit_sp+5] = gambit_r4;
  gambit_r2 = gambit_r4;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r3 = 5;
  gambit_r0 = gambit_bb94__20_ps;
  (gambit_sp += 5);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb84__20_ps);
  } else {
    return gambit_bb84__20_ps();
  }
}

function gambit_bb260__20_ps() {
  gambit_r1 = undefined;
  (gambit_sp -= 2);
  return gambit_r0;
}

function gambit_bb299__20_ps() {
  gambit_r0 = gambit_stack[gambit_sp-2](true)[7];
  gambit_r2 = gambit_r0.val;
  gambit_r1 = gambit_stack[gambit_sp-2](true)[1];
  gambit_r0 = gambit_bb300__20_ps;
  return gambit_bb282__20_ps();
}

function gambit_bb301__20_ps() { // return-point
  return gambit_bb302__20_ps();
}

gambit_bb301__20_ps.id = 32;
gambit_bb301__20_ps.parent = gambit_bb1__20_ps;
gambit_bb301__20_ps.fs = 3;
gambit_bb301__20_ps.link = 1;

function gambit_bb284__20_ps() {
  gambit_r3 = gambit_cst__20_ps[11];
  gambit_r1 = gambit_cst__20_ps[12];
  gambit_r0 = gambit_bb286__20_ps;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb285__20_ps);
  } else {
    return gambit_bb285__20_ps();
  }
}

function gambit_bb292__20_ps() {
  gambit_r2 = gambit_r1;
  return gambit_bb284__20_ps();
}

function gambit_bb294__20_ps() { // return-point
  gambit_r1 = gambit_r1 - 1;
  gambit_r1 = gambit_cst__20_ps[26][gambit_r1];
  gambit_r2 = gambit_stack[gambit_sp] & 3;
  gambit_r2 = gambit_cst__20_ps[31][gambit_r2];
  gambit_r0 = gambit_bb291__20_ps;
  gambit_nargs = 2;
  --gambit_sp;
  return gambit_stack[gambit_sp]();
}

gambit_bb294__20_ps.id = 33;
gambit_bb294__20_ps.parent = gambit_bb1__20_ps;
gambit_bb294__20_ps.fs = 5;
gambit_bb294__20_ps.link = 1;

function gambit_bb436__20_ps() {
  gambit_nargs = 3;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+2](true)[1]();
}

function gambit_bb58__20_ps() { // return-point
  gambit_r1.codes[0] = 45;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb59__20_ps);
  } else {
    return gambit_bb59__20_ps();
  }
}

gambit_bb58__20_ps.id = 34;
gambit_bb58__20_ps.parent = gambit_bb1__20_ps;
gambit_bb58__20_ps.fs = 1;
gambit_bb58__20_ps.link = 1;

function gambit_bb52__20_ps() {
  gambit_r4 = (gambit_r3 / 10) | 0;
  if (gambit_r4 === 0) {
    gambit_r1 = gambit_r1 + gambit_r2;
    gambit_r1 = gambit_make_string(gambit_r1,0);
    return gambit_bb54__20_ps();
  } else {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r2;
    gambit_stack[gambit_sp+3] = gambit_r3;
    gambit_r3 = gambit_r4;
    gambit_r2 = gambit_r2 + 1;
    gambit_r0 = gambit_bb57__20_ps;
    (gambit_sp += 3);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb52__20_ps);
    } else {
      return gambit_bb52__20_ps();
    }
  }
}

function gambit_bb441__20_ps() {
  gambit_nargs = 3;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+2](true)[1]();
}

function gambit_bb425__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[49];
  gambit_r1 = gambit_cst__20_ps[50];
  gambit_r0 = gambit_stack[gambit_sp];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb426__20_ps);
  } else {
    return gambit_bb426__20_ps();
  }
}

gambit_bb425__20_ps.id = 35;
gambit_bb425__20_ps.parent = gambit_bb1__20_ps;
gambit_bb425__20_ps.fs = 4;
gambit_bb425__20_ps.link = 4;

function gambit_bb396__20_ps() { // return-point
  gambit_r2 = 52;
  gambit_r1 = 0;
  gambit_r0 = gambit_bb397__20_ps;
  if (gambit_r1 < gambit_r2) {
    return gambit_bb37__20_ps();
  } else {
    return gambit_bb44__20_ps();
  }
}

gambit_bb396__20_ps.id = 36;
gambit_bb396__20_ps.parent = gambit_bb1__20_ps;
gambit_bb396__20_ps.fs = 2;
gambit_bb396__20_ps.link = 1;

function gambit_bb374__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb374__20_ps.id = 37;
gambit_bb374__20_ps.parent = gambit_bb1__20_ps;
gambit_bb374__20_ps.fs = 4;
gambit_bb374__20_ps.link = 4;

function gambit_bb373__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb373__20_ps.id = 38;
gambit_bb373__20_ps.parent = gambit_bb1__20_ps;
gambit_bb373__20_ps.fs = 4;
gambit_bb373__20_ps.link = 4;

function gambit_bb379__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb379__20_ps.id = 39;
gambit_bb379__20_ps.parent = gambit_bb1__20_ps;
gambit_bb379__20_ps.fs = 4;
gambit_bb379__20_ps.link = 4;

function gambit_bb381__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb381__20_ps.id = 40;
gambit_bb381__20_ps.parent = gambit_bb1__20_ps;
gambit_bb381__20_ps.fs = 4;
gambit_bb381__20_ps.link = 4;

function gambit_bb383__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb383__20_ps.id = 41;
gambit_bb383__20_ps.parent = gambit_bb1__20_ps;
gambit_bb383__20_ps.fs = 4;
gambit_bb383__20_ps.link = 4;

function gambit_bb385__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb385__20_ps.id = 42;
gambit_bb385__20_ps.parent = gambit_bb1__20_ps;
gambit_bb385__20_ps.fs = 4;
gambit_bb385__20_ps.link = 4;

function gambit_bb387__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb387__20_ps.id = 43;
gambit_bb387__20_ps.parent = gambit_bb1__20_ps;
gambit_bb387__20_ps.fs = 4;
gambit_bb387__20_ps.link = 4;

function gambit_bb389__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb389__20_ps.id = 44;
gambit_bb389__20_ps.parent = gambit_bb1__20_ps;
gambit_bb389__20_ps.fs = 4;
gambit_bb389__20_ps.link = 4;

function gambit_bb391__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb391__20_ps.id = 45;
gambit_bb391__20_ps.parent = gambit_bb1__20_ps;
gambit_bb391__20_ps.fs = 4;
gambit_bb391__20_ps.link = 4;

function gambit_bb393__20_ps() { // return-point
  return gambit_bb375__20_ps();
}

gambit_bb393__20_ps.id = 46;
gambit_bb393__20_ps.parent = gambit_bb1__20_ps;
gambit_bb393__20_ps.fs = 4;
gambit_bb393__20_ps.link = 4;

function gambit_bb314__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(1,gambit_r1);
  gambit_r4 = gambit_stack[gambit_sp];
  --gambit_sp;
  return gambit_bb316__20_ps();
}

gambit_bb314__20_ps.id = 47;
gambit_bb314__20_ps.parent = gambit_bb1__20_ps;
gambit_bb314__20_ps.fs = 7;
gambit_bb314__20_ps.link = 3;

function gambit_bb316__20_ps() {
  gambit_r1 = new Gambit_Pair(0,gambit_r1);
  return gambit_bb317__20_ps();
}

function gambit_bb317__20_ps() {
  gambit_r3 = gambit_r1;
  gambit_r2 = gambit_r4;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_bb329__20_ps;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb318__20_ps);
  } else {
    return gambit_bb318__20_ps();
  }
}

function gambit_bb39__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  gambit_r0 = gambit_stack[gambit_sp-2];
  gambit_stack[gambit_sp-2] = gambit_stack[gambit_sp-1];
  (gambit_sp -= 2);
  return gambit_bb41__20_ps();
}

gambit_bb39__20_ps.id = 48;
gambit_bb39__20_ps.parent = gambit_bb1__20_ps;
gambit_bb39__20_ps.fs = 3;
gambit_bb39__20_ps.link = 1;

function gambit_bb41__20_ps() {
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb42__20_ps);
  } else {
    return gambit_bb42__20_ps();
  }
}

function gambit_bb30__20_ps() { // return-point
  gambit_r4 = gambit_stack[gambit_sp];
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_stack[gambit_sp-2];
  (gambit_sp -= 3);
  return gambit_bb31__20_ps();
}

gambit_bb30__20_ps.id = 49;
gambit_bb30__20_ps.parent = gambit_bb1__20_ps;
gambit_bb30__20_ps.fs = 4;
gambit_bb30__20_ps.link = 2;

function gambit_bb262__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp-1].val;
  gambit_r0 = gambit_stack[gambit_sp](true)[4];
  gambit_r2 = gambit_r0.val;
  if (gambit_r2 === 0) {
    var closure5 = gambit_closure_alloc([gambit_bb268__20_ps,gambit_stack[gambit_sp](true)[1],gambit_stack[gambit_sp](true)[2],gambit_stack[gambit_sp](true)[6],gambit_r1]);
    gambit_stack[gambit_sp+1] = closure5;
    gambit_r1 = gambit_stack[gambit_sp+1];
    gambit_r2 = 100;
    gambit_r0 = gambit_bb264__20_ps;
    gambit_nargs = 2;
    (gambit_sp -= 2);
    return gambit_stack[gambit_sp+2](true)[10]();
  } else {
    (gambit_sp -= 2);
    return gambit_bb265__20_ps();
  }
}

gambit_bb262__20_ps.id = 50;
gambit_bb262__20_ps.parent = gambit_bb1__20_ps;
gambit_bb262__20_ps.fs = 3;
gambit_bb262__20_ps.link = 1;

function gambit_bb94__20_ps() { // return-point
  gambit_r0 = gambit_bb242__20_ps;
  return gambit_bb96__20_ps();
}

gambit_bb94__20_ps.id = 51;
gambit_bb94__20_ps.parent = gambit_bb1__20_ps;
gambit_bb94__20_ps.fs = 7;
gambit_bb94__20_ps.link = 3;

function gambit_bb84__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_stack[gambit_sp+2] = gambit_r2;
  gambit_r1 = gambit_r3;
  gambit_r3 = null;
  gambit_r2 = 4;
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb85__20_ps);
  } else {
    return gambit_bb85__20_ps();
  }
}

function gambit_bb300__20_ps() { // return-point
  return gambit_bb302__20_ps();
}

gambit_bb300__20_ps.id = 52;
gambit_bb300__20_ps.parent = gambit_bb1__20_ps;
gambit_bb300__20_ps.fs = 3;
gambit_bb300__20_ps.link = 1;

function gambit_bb302__20_ps() {
  gambit_r2 = gambit_stack[gambit_sp](true)[9];
  gambit_r1 = gambit_stack[gambit_sp](true)[7];
  gambit_r3 = -1;
  gambit_r0 = gambit_bb33__20_ps;
  return gambit_bb12__20_ps();
}

function gambit_bb286__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[42];
  gambit_r1 = gambit_cst__20_ps[43];
  gambit_r0 = gambit_bb287__20_ps;
  gambit_nargs = 3;
  --gambit_sp;
  return gambit_stack[gambit_sp+1]();
}

gambit_bb286__20_ps.id = 53;
gambit_bb286__20_ps.parent = gambit_bb1__20_ps;
gambit_bb286__20_ps.fs = 4;
gambit_bb286__20_ps.link = 1;

function gambit_bb285__20_ps() {
  gambit_nargs = 3;
  return gambit_stack[gambit_sp]();
}

function gambit_bb291__20_ps() { // return-point
  return gambit_bb292__20_ps();
}

gambit_bb291__20_ps.id = 54;
gambit_bb291__20_ps.parent = gambit_bb1__20_ps;
gambit_bb291__20_ps.fs = 4;
gambit_bb291__20_ps.link = 1;

function gambit_bb59__20_ps() {
  --gambit_sp;
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb54__20_ps() {
  gambit_r4 = gambit_r1.codes.length;
  gambit_r2 = gambit_r4 - gambit_r2;
  gambit_r3 = gambit_r3 % 10;
  gambit_r3 = 48 - gambit_r3;
  gambit_r3 = gambit_make_interned_char(gambit_r3);
  gambit_r1.codes[gambit_r2] = gambit_r3.code;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb55__20_ps);
  } else {
    return gambit_bb55__20_ps();
  }
}

function gambit_bb57__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp];
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_stack[gambit_sp-2];
  (gambit_sp -= 3);
  return gambit_bb54__20_ps();
}

gambit_bb57__20_ps.id = 55;
gambit_bb57__20_ps.parent = gambit_bb1__20_ps;
gambit_bb57__20_ps.fs = 3;
gambit_bb57__20_ps.link = 1;

function gambit_bb426__20_ps() {
  gambit_nargs = 5;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1](true)[1]();
}

function gambit_bb397__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp](true)[6];
  gambit_r0 = gambit_bb411__20_ps;
  if (gambit_r2 instanceof Gambit_Pair) {
    return gambit_bb399__20_ps();
  } else {
    return gambit_bb408__20_ps();
  }
}

gambit_bb397__20_ps.id = 56;
gambit_bb397__20_ps.parent = gambit_bb1__20_ps;
gambit_bb397__20_ps.fs = 2;
gambit_bb397__20_ps.link = 1;

function gambit_bb375__20_ps() {
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[51];
  gambit_r1 = gambit_cst__20_ps[52];
  gambit_r0 = gambit_stack[gambit_sp];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb376__20_ps);
  } else {
    return gambit_bb376__20_ps();
  }
}

function gambit_bb329__20_ps() { // return-point
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.cdr;
    if (gambit_r2 instanceof Gambit_Pair) {
      gambit_r3 = gambit_r2.cdr;
      if (gambit_r3 instanceof Gambit_Pair) {
        gambit_r4 = gambit_r3.cdr;
        if (gambit_r4 instanceof Gambit_Pair) {
          gambit_r0 = gambit_r4.cdr;
          if (gambit_r0 instanceof Gambit_Pair) {
            gambit_stack[gambit_sp+1] = gambit_r0.cdr;
            if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
              ++gambit_sp;
              gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp].cdr;
              if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
                ++gambit_sp;
                gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp].cdr;
                if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
                  ++gambit_sp;
                  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp].cdr;
                  if (gambit_stack[gambit_sp+1] instanceof Gambit_Pair) {
                    ++gambit_sp;
                    gambit_r1 = gambit_cst__20_ps[46];
                    gambit_r0 = gambit_bb340__20_ps;
                    gambit_nargs = 1;
                    (gambit_sp -= 4);
                    return gambit_stack[gambit_sp-5]();
                  } else {
                    ++gambit_sp;
                    gambit_r1 = gambit_r1.car;
                    gambit_stack[gambit_sp] = gambit_stack[gambit_sp-3];
                    gambit_stack[gambit_sp-3] = gambit_r1;
                    gambit_r1 = gambit_r2.car;
                    gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-2];
                    gambit_stack[gambit_sp-2] = gambit_r1;
                    gambit_r1 = gambit_r3.car;
                    gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp-1];
                    gambit_stack[gambit_sp-1] = gambit_r1;
                    gambit_r1 = gambit_r4.car;
                    gambit_stack[gambit_sp+3] = gambit_stack[gambit_sp];
                    gambit_stack[gambit_sp] = gambit_r1;
                    gambit_r1 = gambit_r0.car;
                    gambit_stack[gambit_sp+4] = gambit_stack[gambit_sp+1];
                    gambit_stack[gambit_sp+1] = gambit_r1;
                    gambit_r3 = gambit_stack[gambit_sp+2].car;
                    gambit_r2 = gambit_stack[gambit_sp+4].car;
                    gambit_r1 = gambit_stack[gambit_sp+3].car;
                    gambit_r0 = gambit_bb339__20_ps;
                    gambit_nargs = 8;
                    ++gambit_sp;
                    return gambit_stack[gambit_sp-9]();
                  }
                } else {
                  ++gambit_sp;
                  gambit_r1 = gambit_r1.car;
                  gambit_stack[gambit_sp] = gambit_stack[gambit_sp-2];
                  gambit_stack[gambit_sp-2] = gambit_r1;
                  gambit_r1 = gambit_r2.car;
                  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-1];
                  gambit_stack[gambit_sp-1] = gambit_r1;
                  gambit_r1 = gambit_r3.car;
                  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp];
                  gambit_stack[gambit_sp] = gambit_r1;
                  gambit_r1 = gambit_r4.car;
                  gambit_stack[gambit_sp+3] = gambit_stack[gambit_sp+1];
                  gambit_stack[gambit_sp+1] = gambit_r1;
                  gambit_r3 = gambit_stack[gambit_sp+3].car;
                  gambit_r2 = gambit_stack[gambit_sp+2].car;
                  gambit_r1 = gambit_r0.car;
                  gambit_r0 = gambit_bb344__20_ps;
                  gambit_nargs = 7;
                  ++gambit_sp;
                  return gambit_stack[gambit_sp-8]();
                }
              } else {
                ++gambit_sp;
                gambit_r1 = gambit_r1.car;
                gambit_stack[gambit_sp] = gambit_stack[gambit_sp-1];
                gambit_stack[gambit_sp-1] = gambit_r1;
                gambit_r1 = gambit_r2.car;
                gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp];
                gambit_stack[gambit_sp] = gambit_r1;
                gambit_r1 = gambit_r3.car;
                gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp+1];
                gambit_stack[gambit_sp+1] = gambit_r1;
                gambit_r3 = gambit_stack[gambit_sp+2].car;
                gambit_r2 = gambit_r0.car;
                gambit_r1 = gambit_r4.car;
                gambit_r0 = gambit_bb346__20_ps;
                gambit_nargs = 6;
                ++gambit_sp;
                return gambit_stack[gambit_sp-7]();
              }
            } else {
              ++gambit_sp;
              gambit_stack[gambit_sp] = gambit_r1.car;
              gambit_stack[gambit_sp+1] = gambit_r2.car;
              gambit_r1 = gambit_r0.car;
              gambit_stack[gambit_sp+2] = gambit_r3;
              gambit_r3 = gambit_r1;
              gambit_r2 = gambit_r4.car;
              gambit_r1 = gambit_stack[gambit_sp+2].car;
              gambit_r0 = gambit_bb348__20_ps;
              gambit_nargs = 5;
              ++gambit_sp;
              return gambit_stack[gambit_sp-6]();
            }
          } else {
            gambit_stack[gambit_sp+1] = gambit_r1.car;
            gambit_r1 = gambit_r4.car;
            gambit_stack[gambit_sp+2] = gambit_r3;
            gambit_r3 = gambit_r1;
            gambit_r1 = gambit_stack[gambit_sp+2].car;
            gambit_stack[gambit_sp+2] = gambit_r2;
            gambit_r2 = gambit_r1;
            gambit_r1 = gambit_stack[gambit_sp+2].car;
            gambit_r0 = gambit_bb350__20_ps;
            gambit_nargs = 4;
            ++gambit_sp;
            return gambit_stack[gambit_sp-5]();
          }
        } else {
          gambit_r3 = gambit_r3.car;
          gambit_r2 = gambit_r2.car;
          gambit_r1 = gambit_r1.car;
          gambit_r0 = gambit_bb352__20_ps;
          gambit_nargs = 3;
          return gambit_stack[gambit_sp-4]();
        }
      } else {
        gambit_r2 = gambit_r2.car;
        gambit_r1 = gambit_r1.car;
        gambit_r0 = gambit_bb354__20_ps;
        gambit_nargs = 2;
        return gambit_stack[gambit_sp-4]();
      }
    } else {
      gambit_r1 = gambit_r1.car;
      gambit_r0 = gambit_bb356__20_ps;
      gambit_nargs = 1;
      return gambit_stack[gambit_sp-4]();
    }
  } else {
    gambit_r0 = gambit_bb358__20_ps;
    gambit_nargs = 0;
    return gambit_stack[gambit_sp-4]();
  }
}

gambit_bb329__20_ps.id = 57;
gambit_bb329__20_ps.parent = gambit_bb1__20_ps;
gambit_bb329__20_ps.fs = 6;
gambit_bb329__20_ps.link = 3;

function gambit_bb318__20_ps() {
  if (gambit_r3 instanceof Gambit_Pair) {
    return gambit_bb319__20_ps();
  } else {
    return gambit_bb328__20_ps();
  }
}

function gambit_bb42__20_ps() {
  --gambit_sp;
  return gambit_r0;
}

function gambit_bb268__20_ps() { // closure-entry-point
  if (gambit_nargs !== 0) {
    return gambit_wrong_nargs(gambit_r4);
  }
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r4;
  gambit_r1 = gambit_r4(true)[4];
  gambit_r0 = gambit_bb269__20_ps;
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb49__20_ps);
  } else {
    return gambit_bb49__20_ps();
  }
}

gambit_bb268__20_ps.id = 58;
gambit_bb268__20_ps.parent = gambit_bb1__20_ps;
gambit_bb268__20_ps.nb_closed = 4;

function gambit_bb264__20_ps() { // return-point
  return gambit_bb265__20_ps();
}

gambit_bb264__20_ps.id = 59;
gambit_bb264__20_ps.parent = gambit_bb1__20_ps;
gambit_bb264__20_ps.fs = 1;
gambit_bb264__20_ps.link = 1;

function gambit_bb265__20_ps() {
  gambit_r1 = false;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb266__20_ps);
  } else {
    return gambit_bb266__20_ps();
  }
}

function gambit_bb242__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp] * 5;
  gambit_r1 = gambit_stack[gambit_sp-6];
  gambit_r3 = 1;
  gambit_r0 = gambit_bb243__20_ps;
  ++gambit_sp;
  return gambit_bb84__20_ps();
}

gambit_bb242__20_ps.id = 60;
gambit_bb242__20_ps.parent = gambit_bb1__20_ps;
gambit_bb242__20_ps.fs = 7;
gambit_bb242__20_ps.link = 3;

function gambit_bb96__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_r0 = gambit_bb105__20_ps;
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb97__20_ps);
  } else {
    return gambit_bb97__20_ps();
  }
}

function gambit_bb85__20_ps() {
  if (gambit_r2 >= 0) {
    gambit_r4 = gambit_r1 * gambit_r2;
    gambit_r4 = gambit_stack[gambit_sp] + gambit_r4;
    gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-1].val;
    gambit_r4 = gambit_stack[gambit_sp+1][gambit_r4];
    gambit_r2 = gambit_r2 - 1;
    if (gambit_r4 === 52) {
      ++gambit_sp;
      if (gambit_r2 >= 0) {
        return gambit_bb88__20_ps();
      } else {
        return gambit_bb92__20_ps();
      }
    } else {
      ++gambit_sp;
      gambit_r3 = new Gambit_Pair(gambit_r4,gambit_r3);
      if (gambit_r2 >= 0) {
        return gambit_bb88__20_ps();
      } else {
        return gambit_bb92__20_ps();
      }
    }
  } else {
    gambit_r1 = gambit_r3;
    (gambit_sp -= 2);
    return gambit_r0;
  }
}

function gambit_bb33__20_ps() { // return-point
  gambit_stack[gambit_sp-1] = gambit_stack[gambit_sp];
  --gambit_sp;
  return gambit_bb34__20_ps();
}

gambit_bb33__20_ps.id = 61;
gambit_bb33__20_ps.parent = gambit_bb1__20_ps;
gambit_bb33__20_ps.fs = 3;
gambit_bb33__20_ps.link = 1;

function gambit_bb287__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_stack[gambit_sp-2];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb288__20_ps);
  } else {
    return gambit_bb288__20_ps();
  }
}

gambit_bb287__20_ps.id = 62;
gambit_bb287__20_ps.parent = gambit_bb1__20_ps;
gambit_bb287__20_ps.fs = 3;
gambit_bb287__20_ps.link = 1;

function gambit_bb55__20_ps() {
  return gambit_r0;
}

function gambit_bb411__20_ps() { // return-point
  gambit_r0 = gambit_stack[gambit_sp](true)[3];
  gambit_r0.val = gambit_r1;
  gambit_r0 = gambit_stack[gambit_sp](true)[5];
  gambit_r1 = gambit_make_vector(26,0);
  gambit_r0.val = gambit_r1;
  gambit_r2 = 25;
  gambit_r1 = 0;
  gambit_r0 = gambit_bb412__20_ps;
  if (gambit_r1 < gambit_r2) {
    return gambit_bb37__20_ps();
  } else {
    return gambit_bb44__20_ps();
  }
}

gambit_bb411__20_ps.id = 63;
gambit_bb411__20_ps.parent = gambit_bb1__20_ps;
gambit_bb411__20_ps.fs = 2;
gambit_bb411__20_ps.link = 1;

function gambit_bb399__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_r1 = gambit_r2;
  gambit_r0 = gambit_bb400__20_ps;
  (gambit_sp += 3);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb97__20_ps);
  } else {
    return gambit_bb97__20_ps();
  }
}

function gambit_bb408__20_ps() {
  gambit_r1 = null;
  return gambit_r0;
}

function gambit_bb376__20_ps() {
  gambit_nargs = 3;
  (gambit_sp -= 4);
  return gambit_stack[gambit_sp+2]();
}

function gambit_bb340__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb340__20_ps.id = 64;
gambit_bb340__20_ps.parent = gambit_bb1__20_ps;
gambit_bb340__20_ps.fs = 6;
gambit_bb340__20_ps.link = 3;

function gambit_bb339__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb339__20_ps.id = 65;
gambit_bb339__20_ps.parent = gambit_bb1__20_ps;
gambit_bb339__20_ps.fs = 6;
gambit_bb339__20_ps.link = 3;

function gambit_bb344__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb344__20_ps.id = 66;
gambit_bb344__20_ps.parent = gambit_bb1__20_ps;
gambit_bb344__20_ps.fs = 6;
gambit_bb344__20_ps.link = 3;

function gambit_bb346__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb346__20_ps.id = 67;
gambit_bb346__20_ps.parent = gambit_bb1__20_ps;
gambit_bb346__20_ps.fs = 6;
gambit_bb346__20_ps.link = 3;

function gambit_bb348__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb348__20_ps.id = 68;
gambit_bb348__20_ps.parent = gambit_bb1__20_ps;
gambit_bb348__20_ps.fs = 6;
gambit_bb348__20_ps.link = 3;

function gambit_bb350__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb350__20_ps.id = 69;
gambit_bb350__20_ps.parent = gambit_bb1__20_ps;
gambit_bb350__20_ps.fs = 6;
gambit_bb350__20_ps.link = 3;

function gambit_bb352__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb352__20_ps.id = 70;
gambit_bb352__20_ps.parent = gambit_bb1__20_ps;
gambit_bb352__20_ps.fs = 6;
gambit_bb352__20_ps.link = 3;

function gambit_bb354__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb354__20_ps.id = 71;
gambit_bb354__20_ps.parent = gambit_bb1__20_ps;
gambit_bb354__20_ps.fs = 6;
gambit_bb354__20_ps.link = 3;

function gambit_bb356__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb356__20_ps.id = 72;
gambit_bb356__20_ps.parent = gambit_bb1__20_ps;
gambit_bb356__20_ps.fs = 6;
gambit_bb356__20_ps.link = 3;

function gambit_bb358__20_ps() { // return-point
  return gambit_bb341__20_ps();
}

gambit_bb358__20_ps.id = 73;
gambit_bb358__20_ps.parent = gambit_bb1__20_ps;
gambit_bb358__20_ps.fs = 6;
gambit_bb358__20_ps.link = 3;

function gambit_bb319__20_ps() {
  gambit_r4 = gambit_r3.car;
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  gambit_r2 = gambit_r4;
  gambit_r1 = gambit_stack[gambit_sp+3];
  gambit_r0 = gambit_bb321__20_ps;
  (gambit_sp += 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb320__20_ps);
  } else {
    return gambit_bb320__20_ps();
  }
}

function gambit_bb328__20_ps() {
  gambit_r1 = null;
  return gambit_r0;
}

function gambit_bb269__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[53];
  gambit_r0 = gambit_bb270__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[1]();
}

gambit_bb269__20_ps.id = 74;
gambit_bb269__20_ps.parent = gambit_bb1__20_ps;
gambit_bb269__20_ps.fs = 2;
gambit_bb269__20_ps.link = 1;

function gambit_bb266__20_ps() {
  --gambit_sp;
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb243__20_ps() { // return-point
  gambit_r0 = gambit_bb244__20_ps;
  return gambit_bb96__20_ps();
}

gambit_bb243__20_ps.id = 75;
gambit_bb243__20_ps.parent = gambit_bb1__20_ps;
gambit_bb243__20_ps.fs = 8;
gambit_bb243__20_ps.link = 3;

function gambit_bb105__20_ps() { // return-point
  if (5 === gambit_r1) {
    gambit_r1 = gambit_stack[gambit_sp];
    gambit_r0 = gambit_bb114__20_ps;
    if (gambit_r1 instanceof Gambit_Pair) {
      return gambit_bb110__20_ps();
    } else {
      return gambit_bb113__20_ps();
    }
  } else {
    gambit_r1 = false;
    return gambit_bb116__20_ps();
  }
}

gambit_bb105__20_ps.id = 76;
gambit_bb105__20_ps.parent = gambit_bb1__20_ps;
gambit_bb105__20_ps.fs = 2;
gambit_bb105__20_ps.link = 1;

function gambit_bb97__20_ps() {
  gambit_r2 = gambit_r1;
  gambit_r1 = 0;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb98__20_ps);
  } else {
    return gambit_bb98__20_ps();
  }
}

function gambit_bb88__20_ps() {
  gambit_r4 = gambit_r1 * gambit_r2;
  gambit_r4 = gambit_stack[gambit_sp-1] + gambit_r4;
  gambit_stack[gambit_sp] = gambit_stack[gambit_sp-2].val;
  gambit_r4 = gambit_stack[gambit_sp][gambit_r4];
  if (gambit_r4 === 52) {
    return gambit_bb89__20_ps();
  } else {
    gambit_r3 = new Gambit_Pair(gambit_r4,gambit_r3);
    return gambit_bb89__20_ps();
  }
}

function gambit_bb92__20_ps() {
  gambit_r1 = gambit_r3;
  (gambit_sp -= 3);
  return gambit_r0;
}

function gambit_bb288__20_ps() {
  gambit_nargs = 2;
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+2]();
}

function gambit_bb412__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp](true)[5];
  gambit_r3 = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp](true)[1];
  gambit_r1 = gambit_stack[gambit_sp](true)[8];
  gambit_r0 = gambit_bb281__20_ps;
  if (gambit_r3 instanceof Gambit_Pair) {
    ++gambit_sp;
    return gambit_bb415__20_ps();
  } else {
    ++gambit_sp;
    return gambit_bb420__20_ps();
  }
}

gambit_bb412__20_ps.id = 77;
gambit_bb412__20_ps.parent = gambit_bb1__20_ps;
gambit_bb412__20_ps.fs = 2;
gambit_bb412__20_ps.link = 1;

function gambit_bb400__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp-1].val;
  gambit_r2 = gambit_r2 * 3581;
  gambit_r2 = gambit_r2 + 12751;
  gambit_r2 = ((gambit_r2 % 131072) + 131072) % 131072;
  gambit_stack[gambit_sp-1].val = gambit_r2;
  gambit_r2 = gambit_stack[gambit_sp-1].val;
  gambit_r2 = (gambit_r2 / 2) | 0;
  gambit_r2 = ((gambit_r2 % gambit_r1) + gambit_r1) % gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb398__20_ps;
  if (gambit_r2 === 0) {
    --gambit_sp;
    return gambit_r0;
  } else {
    --gambit_sp;
    return gambit_bb403__20_ps();
  }
}

gambit_bb400__20_ps.id = 78;
gambit_bb400__20_ps.parent = gambit_bb1__20_ps;
gambit_bb400__20_ps.fs = 3;
gambit_bb400__20_ps.link = 1;

function gambit_bb341__20_ps() {
  gambit_r2 = gambit_r1;
  gambit_r3 = gambit_cst__20_ps[54];
  gambit_r1 = gambit_cst__20_ps[55];
  gambit_r0 = gambit_bb310__20_ps;
  gambit_nargs = 3;
  return gambit_stack[gambit_sp-4]();
}

function gambit_bb321__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp].cdr;
  if (gambit_r2 instanceof Gambit_Pair) {
    gambit_r3 = gambit_r2.car;
    gambit_stack[gambit_sp] = gambit_r1;
    gambit_stack[gambit_sp+1] = gambit_r2;
    gambit_r2 = gambit_r3;
    gambit_r1 = gambit_stack[gambit_sp-1];
    gambit_r0 = gambit_bb327__20_ps;
    gambit_nargs = 2;
    ++gambit_sp;
    return gambit_stack[gambit_sp-3]();
  } else {
    gambit_stack[gambit_sp-2] = gambit_r1;
    gambit_r1 = null;
    return gambit_bb324__20_ps();
  }
}

gambit_bb321__20_ps.id = 79;
gambit_bb321__20_ps.parent = gambit_bb1__20_ps;
gambit_bb321__20_ps.fs = 4;
gambit_bb321__20_ps.link = 1;

function gambit_bb320__20_ps() {
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-2]();
}

function gambit_bb270__20_ps() { // return-point
  gambit_r0 = gambit_bb271__20_ps;
  gambit_nargs = 1;
  return gambit_stack[gambit_sp](true)[2]();
}

gambit_bb270__20_ps.id = 80;
gambit_bb270__20_ps.parent = gambit_bb1__20_ps;
gambit_bb270__20_ps.fs = 2;
gambit_bb270__20_ps.link = 1;

function gambit_bb244__20_ps() { // return-point
  gambit_r2 = gambit_r1 + gambit_stack[gambit_sp];
  gambit_r3 = gambit_stack[gambit_sp-3].val;
  gambit_r2 = gambit_r3 + gambit_r2;
  gambit_stack[gambit_sp-3].val = gambit_r2;
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_bb245__20_ps;
  if (typeof gambit_r1 === "number") {
    ++gambit_sp;
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    ++gambit_sp;
    return gambit_bb62__20_ps();
  }
}

gambit_bb244__20_ps.id = 81;
gambit_bb244__20_ps.parent = gambit_bb1__20_ps;
gambit_bb244__20_ps.fs = 8;
gambit_bb244__20_ps.link = 3;

function gambit_bb114__20_ps() { // return-point
  return gambit_bb116__20_ps();
}

gambit_bb114__20_ps.id = 82;
gambit_bb114__20_ps.parent = gambit_bb1__20_ps;
gambit_bb114__20_ps.fs = 2;
gambit_bb114__20_ps.link = 1;

function gambit_bb110__20_ps() {
  gambit_r2 = gambit_r1.cdr;
  if (gambit_r2 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.car;
    gambit_r2 = gambit_r2 & 3;
    gambit_r3 = gambit_r1.cdr;
    gambit_r3 = gambit_r3.car;
    gambit_r3 = gambit_r3 & 3;
    if (gambit_r2 === gambit_r3) {
      gambit_r1 = gambit_r1.cdr;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb109__20_ps);
      } else {
        return gambit_bb109__20_ps();
      }
    } else {
      gambit_r1 = false;
      return gambit_r0;
    }
  } else {
    gambit_r1 = true;
    return gambit_r0;
  }
}

function gambit_bb113__20_ps() {
  gambit_r1 = true;
  return gambit_r0;
}

function gambit_bb116__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb123__20_ps;
  if (gambit_r1 instanceof Gambit_Pair) {
    ++gambit_sp;
    return gambit_bb117__20_ps();
  } else {
    ++gambit_sp;
    return gambit_bb120__20_ps();
  }
}

function gambit_bb98__20_ps() {
  if (gambit_r2 instanceof Gambit_Pair) {
    gambit_r1 = gambit_r1 + 1;
    gambit_r2 = gambit_r2.cdr;
    if (gambit_r2 instanceof Gambit_Pair) {
      gambit_r1 = gambit_r1 + 1;
      gambit_r2 = gambit_r2.cdr;
      if (gambit_r2 instanceof Gambit_Pair) {
        gambit_r2 = gambit_r2.cdr;
        gambit_r1 = gambit_r1 + 1;
        if (--gambit_pollcount === 0) {
          return gambit_poll(gambit_bb98__20_ps);
        } else {
          return gambit_bb98__20_ps();
        }
      } else {
        return gambit_r0;
      }
    } else {
      return gambit_r0;
    }
  } else {
    return gambit_r0;
  }
}

function gambit_bb89__20_ps() {
  gambit_r2 = gambit_r2 - 1;
  --gambit_sp;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb85__20_ps);
  } else {
    return gambit_bb85__20_ps();
  }
}

function gambit_bb281__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp](true)[5];
  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp](true)[8];
  gambit_r1 = gambit_stack[gambit_sp](true)[1];
  gambit_r3 = 53;
  gambit_r2 = 25;
  gambit_r0 = gambit_bb43__20_ps;
  (gambit_sp += 2);
  return gambit_bb282__20_ps();
}

gambit_bb281__20_ps.id = 83;
gambit_bb281__20_ps.parent = gambit_bb1__20_ps;
gambit_bb281__20_ps.fs = 2;
gambit_bb281__20_ps.link = 1;

function gambit_bb415__20_ps() {
  gambit_r4 = gambit_r3.car;
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  gambit_stack[gambit_sp+5] = gambit_stack[gambit_sp];
  gambit_stack[gambit_sp+6] = gambit_r1;
  gambit_r2 = gambit_r4;
  gambit_r1 = gambit_stack[gambit_sp+3];
  gambit_r3 = 52;
  gambit_r0 = gambit_bb416__20_ps;
  (gambit_sp += 6);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb282__20_ps);
  } else {
    return gambit_bb282__20_ps();
  }
}

function gambit_bb420__20_ps() {
  gambit_r1 = undefined;
  --gambit_sp;
  return gambit_r0;
}

function gambit_bb398__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r2 = gambit_r1.cdr;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb409__20_ps;
  if (gambit_r2 instanceof Gambit_Pair) {
    ++gambit_sp;
    return gambit_bb399__20_ps();
  } else {
    ++gambit_sp;
    return gambit_bb408__20_ps();
  }
}

gambit_bb398__20_ps.id = 84;
gambit_bb398__20_ps.parent = gambit_bb1__20_ps;
gambit_bb398__20_ps.fs = 2;
gambit_bb398__20_ps.link = 1;

function gambit_bb403__20_ps() {
  gambit_r3 = gambit_r1.cdr;
  gambit_r2 = gambit_r2 - 1;
  if (gambit_r2 === 0) {
    return gambit_bb404__20_ps();
  } else {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r1;
    gambit_stack[gambit_sp+3] = gambit_r3;
    gambit_r2 = gambit_r2 - 1;
    gambit_r1 = gambit_r3.cdr;
    gambit_r0 = gambit_bb406__20_ps;
    (gambit_sp += 3);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb402__20_ps);
    } else {
      return gambit_bb402__20_ps();
    }
  }
}

function gambit_bb310__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp-5];
  gambit_stack[gambit_sp+3] = gambit_stack[gambit_sp-4];
  gambit_r3 = gambit_stack[gambit_sp].cdr;
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_bb361__20_ps;
  if (gambit_r3 instanceof Gambit_Pair) {
    (gambit_sp += 3);
    return gambit_bb311__20_ps();
  } else {
    (gambit_sp += 3);
    return gambit_bb360__20_ps();
  }
}

gambit_bb310__20_ps.id = 85;
gambit_bb310__20_ps.parent = gambit_bb1__20_ps;
gambit_bb310__20_ps.fs = 6;
gambit_bb310__20_ps.link = 3;

function gambit_bb327__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r3 = gambit_stack[gambit_sp].cdr;
  gambit_r2 = gambit_stack[gambit_sp-2];
  gambit_r1 = gambit_stack[gambit_sp-3];
  gambit_r0 = gambit_bb323__20_ps;
  if (gambit_r3 instanceof Gambit_Pair) {
    ++gambit_sp;
    return gambit_bb319__20_ps();
  } else {
    ++gambit_sp;
    return gambit_bb328__20_ps();
  }
}

gambit_bb327__20_ps.id = 86;
gambit_bb327__20_ps.parent = gambit_bb1__20_ps;
gambit_bb327__20_ps.fs = 5;
gambit_bb327__20_ps.link = 1;

function gambit_bb324__20_ps() {
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp-2],gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb325__20_ps);
  } else {
    return gambit_bb325__20_ps();
  }
}

function gambit_bb271__20_ps() { // return-point
  gambit_r0 = gambit_stack[gambit_sp-1];
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb272__20_ps);
  } else {
    return gambit_bb272__20_ps();
  }
}

gambit_bb271__20_ps.id = 87;
gambit_bb271__20_ps.parent = gambit_bb1__20_ps;
gambit_bb271__20_ps.fs = 2;
gambit_bb271__20_ps.link = 1;

function gambit_bb245__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[56];
  gambit_r0 = gambit_bb246__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-5]();
}

gambit_bb245__20_ps.id = 88;
gambit_bb245__20_ps.parent = gambit_bb1__20_ps;
gambit_bb245__20_ps.fs = 9;
gambit_bb245__20_ps.link = 3;

function gambit_bb109__20_ps() {
  if (gambit_r1 instanceof Gambit_Pair) {
    return gambit_bb110__20_ps();
  } else {
    return gambit_bb113__20_ps();
  }
}

function gambit_bb123__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r3 = 100;
  gambit_r0 = gambit_stack[gambit_sp-2];
  (gambit_sp -= 3);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb126__20_ps);
  } else {
    return gambit_bb126__20_ps();
  }
}

gambit_bb123__20_ps.id = 89;
gambit_bb123__20_ps.parent = gambit_bb1__20_ps;
gambit_bb123__20_ps.fs = 3;
gambit_bb123__20_ps.link = 1;

function gambit_bb117__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_r1 = gambit_r1.car;
  gambit_r0 = gambit_bb119__20_ps;
  (gambit_sp += 2);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb118__20_ps);
  } else {
    return gambit_bb118__20_ps();
  }
}

function gambit_bb120__20_ps() {
  gambit_r1 = null;
  return gambit_r0;
}

function gambit_bb43__20_ps() { // return-point
  gambit_r2 = 5;
  gambit_r1 = 0;
  gambit_r0 = gambit_bb45__20_ps;
  if (gambit_r1 < gambit_r2) {
    return gambit_bb37__20_ps();
  } else {
    return gambit_bb44__20_ps();
  }
}

gambit_bb43__20_ps.id = 90;
gambit_bb43__20_ps.parent = gambit_bb1__20_ps;
gambit_bb43__20_ps.fs = 2;
gambit_bb43__20_ps.link = 1;

function gambit_bb416__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp].cdr;
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.car;
    gambit_stack[gambit_sp] = gambit_r1;
    gambit_stack[gambit_sp+1] = gambit_stack[gambit_sp-4];
    gambit_stack[gambit_sp+2] = gambit_stack[gambit_sp-2];
    gambit_r1 = gambit_stack[gambit_sp-1];
    gambit_r3 = 52;
    gambit_r0 = gambit_bb413__20_ps;
    (gambit_sp += 2);
    return gambit_bb282__20_ps();
  } else {
    gambit_r1 = undefined;
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb419__20_ps);
    } else {
      return gambit_bb419__20_ps();
    }
  }
}

gambit_bb416__20_ps.id = 91;
gambit_bb416__20_ps.parent = gambit_bb1__20_ps;
gambit_bb416__20_ps.fs = 5;
gambit_bb416__20_ps.link = 2;

function gambit_bb409__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp].car;
  gambit_r1 = new Gambit_Pair(gambit_r2,gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb410__20_ps);
  } else {
    return gambit_bb410__20_ps();
  }
}

gambit_bb409__20_ps.id = 92;
gambit_bb409__20_ps.parent = gambit_bb1__20_ps;
gambit_bb409__20_ps.fs = 3;
gambit_bb409__20_ps.link = 1;

function gambit_bb404__20_ps() {
  gambit_r2 = gambit_r3.cdr;
  gambit_r1 = gambit_r1.car;
  gambit_r1 = new Gambit_Pair(gambit_r1,gambit_r2);
  gambit_r3.cdr = gambit_r1;
  gambit_r1 = gambit_r3;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb405__20_ps);
  } else {
    return gambit_bb405__20_ps();
  }
}

function gambit_bb406__20_ps() { // return-point
  gambit_r2 = gambit_r1.cdr;
  gambit_r3 = gambit_stack[gambit_sp].car;
  gambit_r2 = new Gambit_Pair(gambit_r3,gambit_r2);
  gambit_r1.cdr = gambit_r2;
  gambit_r3 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_stack[gambit_sp-2];
  (gambit_sp -= 3);
  return gambit_bb404__20_ps();
}

gambit_bb406__20_ps.id = 93;
gambit_bb406__20_ps.parent = gambit_bb1__20_ps;
gambit_bb406__20_ps.fs = 3;
gambit_bb406__20_ps.link = 1;

function gambit_bb402__20_ps() {
  if (gambit_r2 === 0) {
    return gambit_r0;
  } else {
    return gambit_bb403__20_ps();
  }
}

function gambit_bb361__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb362__20_ps);
  } else {
    return gambit_bb362__20_ps();
  }
}

gambit_bb361__20_ps.id = 94;
gambit_bb361__20_ps.parent = gambit_bb1__20_ps;
gambit_bb361__20_ps.fs = 7;
gambit_bb361__20_ps.link = 3;

function gambit_bb323__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  gambit_stack[gambit_sp-4] = gambit_stack[gambit_sp-2];
  (gambit_sp -= 2);
  return gambit_bb324__20_ps();
}

gambit_bb323__20_ps.id = 95;
gambit_bb323__20_ps.parent = gambit_bb1__20_ps;
gambit_bb323__20_ps.fs = 6;
gambit_bb323__20_ps.link = 1;

function gambit_bb325__20_ps() {
  (gambit_sp -= 4);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb272__20_ps() {
  gambit_nargs = 0;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+2](true)[3]();
}

function gambit_bb246__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  if (gambit_stack[gambit_sp] === 0) {
    ++gambit_sp;
    gambit_r2 = gambit_cst__20_ps[57];
    return gambit_bb249__20_ps();
  } else {
    ++gambit_sp;
    gambit_r2 = gambit_stack[gambit_sp-1];
    return gambit_bb249__20_ps();
  }
}

gambit_bb246__20_ps.id = 96;
gambit_bb246__20_ps.parent = gambit_bb1__20_ps;
gambit_bb246__20_ps.fs = 9;
gambit_bb246__20_ps.link = 3;

function gambit_bb126__20_ps() {
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  gambit_r1 = gambit_r2;
  gambit_r0 = gambit_bb124__20_ps;
  (gambit_sp += 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb97__20_ps);
  } else {
    return gambit_bb97__20_ps();
  }
}

function gambit_bb119__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp].cdr;
  gambit_r0 = gambit_bb121__20_ps;
  if (gambit_r1 instanceof Gambit_Pair) {
    ++gambit_sp;
    return gambit_bb117__20_ps();
  } else {
    ++gambit_sp;
    return gambit_bb120__20_ps();
  }
}

gambit_bb119__20_ps.id = 97;
gambit_bb119__20_ps.parent = gambit_bb1__20_ps;
gambit_bb119__20_ps.fs = 2;
gambit_bb119__20_ps.link = 1;

function gambit_bb45__20_ps() { // return-point
  gambit_r3 = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp](true)[1];
  gambit_r1 = gambit_stack[gambit_sp](true)[8];
  gambit_r0 = gambit_bb77__20_ps;
  if (gambit_r3 instanceof Gambit_Pair) {
    return gambit_bb48__20_ps();
  } else {
    return gambit_bb76__20_ps();
  }
}

gambit_bb45__20_ps.id = 98;
gambit_bb45__20_ps.parent = gambit_bb1__20_ps;
gambit_bb45__20_ps.fs = 2;
gambit_bb45__20_ps.link = 1;

function gambit_bb413__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp].cdr;
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_stack[gambit_sp-3];
  (gambit_sp -= 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb414__20_ps);
  } else {
    return gambit_bb414__20_ps();
  }
}

gambit_bb413__20_ps.id = 99;
gambit_bb413__20_ps.parent = gambit_bb1__20_ps;
gambit_bb413__20_ps.fs = 5;
gambit_bb413__20_ps.link = 2;

function gambit_bb419__20_ps() {
  (gambit_sp -= 5);
  return gambit_stack[gambit_sp+2]();
}

function gambit_bb410__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb405__20_ps() {
  return gambit_r0;
}

function gambit_bb362__20_ps() {
  (gambit_sp -= 7);
  return gambit_stack[gambit_sp+3]();
}

function gambit_bb249__20_ps() {
  gambit_r0 = gambit_bb250__20_ps;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_nargs = 2;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp-6]();
}

function gambit_bb124__20_ps() { // return-point
  if (gambit_r1 < 5) {
    gambit_r2 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_stack[gambit_sp-1]);
    gambit_r3 = gambit_stack[gambit_sp] + 100;
    gambit_r1 = gambit_stack[gambit_sp-2];
    gambit_r0 = gambit_stack[gambit_sp-3];
    (gambit_sp -= 4);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb126__20_ps);
    } else {
      return gambit_bb126__20_ps();
    }
  } else {
    gambit_r1 = gambit_stack[gambit_sp-1];
    gambit_r0 = gambit_bb152__20_ps;
    if (gambit_r1 === null) {
      (gambit_sp -= 2);
      return gambit_r0;
    } else {
      (gambit_sp -= 2);
      return gambit_bb129__20_ps();
    }
  }
}

gambit_bb124__20_ps.id = 100;
gambit_bb124__20_ps.parent = gambit_bb1__20_ps;
gambit_bb124__20_ps.fs = 4;
gambit_bb124__20_ps.link = 1;

function gambit_bb121__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb122__20_ps);
  } else {
    return gambit_bb122__20_ps();
  }
}

gambit_bb121__20_ps.id = 101;
gambit_bb121__20_ps.parent = gambit_bb1__20_ps;
gambit_bb121__20_ps.fs = 3;
gambit_bb121__20_ps.link = 1;

function gambit_bb77__20_ps() { // return-point
  gambit_r2 = gambit_cst__20_ps[58];
  gambit_r1 = gambit_cst__20_ps[59];
  gambit_r0 = gambit_bb78__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp](true)[8]();
}

gambit_bb77__20_ps.id = 102;
gambit_bb77__20_ps.parent = gambit_bb1__20_ps;
gambit_bb77__20_ps.fs = 2;
gambit_bb77__20_ps.link = 1;

function gambit_bb48__20_ps() {
  gambit_r4 = gambit_r3.car;
  gambit_stack[gambit_sp+1] = gambit_r0;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_stack[gambit_sp+3] = gambit_r2;
  gambit_stack[gambit_sp+4] = gambit_r3;
  gambit_stack[gambit_sp+5] = gambit_r4;
  gambit_r1 = gambit_r4;
  gambit_r0 = gambit_bb65__20_ps;
  (gambit_sp += 5);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb49__20_ps);
  } else {
    return gambit_bb49__20_ps();
  }
}

function gambit_bb76__20_ps() {
  gambit_r1 = undefined;
  return gambit_r0;
}

function gambit_bb414__20_ps() {
  if (gambit_r3 instanceof Gambit_Pair) {
    return gambit_bb415__20_ps();
  } else {
    return gambit_bb420__20_ps();
  }
}

function gambit_bb250__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_bb251__20_ps;
  if (typeof gambit_r1 === "number") {
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    return gambit_bb62__20_ps();
  }
}

gambit_bb250__20_ps.id = 103;
gambit_bb250__20_ps.parent = gambit_bb1__20_ps;
gambit_bb250__20_ps.fs = 8;
gambit_bb250__20_ps.link = 3;

function gambit_bb152__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_stack[gambit_sp+2] = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp+1];
  gambit_r1 = null;
  gambit_r0 = gambit_bb170__20_ps;
  if (gambit_r2 instanceof Gambit_Pair) {
    (gambit_sp += 2);
    return gambit_bb160__20_ps();
  } else {
    (gambit_sp += 2);
    return gambit_bb162__20_ps();
  }
}

gambit_bb152__20_ps.id = 104;
gambit_bb152__20_ps.parent = gambit_bb1__20_ps;
gambit_bb152__20_ps.fs = 2;
gambit_bb152__20_ps.link = 1;

function gambit_bb129__20_ps() {
  gambit_r2 = gambit_r1.cdr;
  if (gambit_r2 === null) {
    return gambit_r0;
  } else {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r1;
    gambit_r0 = gambit_bb128__20_ps;
    (gambit_sp += 2);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb131__20_ps);
    } else {
      return gambit_bb131__20_ps();
    }
  }
}

function gambit_bb122__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb78__20_ps() { // return-point
  gambit_r0 = gambit_stack[gambit_sp](true)[4];
  gambit_r0.val = 25;
  gambit_r0 = gambit_stack[gambit_sp](true)[7];
  gambit_r0.val = -1;
  gambit_r1 = false;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb79__20_ps);
  } else {
    return gambit_bb79__20_ps();
  }
}

gambit_bb78__20_ps.id = 105;
gambit_bb78__20_ps.parent = gambit_bb1__20_ps;
gambit_bb78__20_ps.fs = 2;
gambit_bb78__20_ps.link = 1;

function gambit_bb65__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[60];
  gambit_r0 = gambit_bb66__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-2]();
}

gambit_bb65__20_ps.id = 106;
gambit_bb65__20_ps.parent = gambit_bb1__20_ps;
gambit_bb65__20_ps.fs = 5;
gambit_bb65__20_ps.link = 1;

function gambit_bb251__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[61];
  gambit_r0 = gambit_bb252__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-4]();
}

gambit_bb251__20_ps.id = 107;
gambit_bb251__20_ps.parent = gambit_bb1__20_ps;
gambit_bb251__20_ps.fs = 8;
gambit_bb251__20_ps.link = 3;

function gambit_bb170__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp].car;
  if (gambit_r2 === 1) {
    gambit_r2 = gambit_stack[gambit_sp].cdr.car;
    if (gambit_r2 === 10) {
      gambit_stack[gambit_sp-1] = gambit_r1;
      gambit_r1 = gambit_stack[gambit_sp].cdr;
      gambit_r0 = gambit_bb179__20_ps;
      if (gambit_r1 instanceof Gambit_Pair) {
        return gambit_bb176__20_ps();
      } else {
        return gambit_bb182__20_ps();
      }
    } else {
      return gambit_bb181__20_ps();
    }
  } else {
    return gambit_bb181__20_ps();
  }
}

gambit_bb170__20_ps.id = 108;
gambit_bb170__20_ps.parent = gambit_bb1__20_ps;
gambit_bb170__20_ps.fs = 4;
gambit_bb170__20_ps.link = 1;

function gambit_bb160__20_ps() {
  gambit_r3 = gambit_r2.car;
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r1 = gambit_r2.cdr;
  gambit_stack[gambit_sp+2] = gambit_r3;
  gambit_r3 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp+2];
  gambit_r2 = 1;
  ++gambit_sp;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb154__20_ps);
  } else {
    return gambit_bb154__20_ps();
  }
}

function gambit_bb162__20_ps() {
  gambit_r2 = null;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb166__20_ps);
  } else {
    return gambit_bb166__20_ps();
  }
}

function gambit_bb128__20_ps() { // return-point
  gambit_r0 = gambit_bb136__20_ps;
  if (gambit_r1 === null) {
    return gambit_r0;
  } else {
    return gambit_bb129__20_ps();
  }
}

gambit_bb128__20_ps.id = 109;
gambit_bb128__20_ps.parent = gambit_bb1__20_ps;
gambit_bb128__20_ps.fs = 2;
gambit_bb128__20_ps.link = 1;

function gambit_bb131__20_ps() {
  if (gambit_r1 === null) {
    return gambit_r0;
  } else {
    return gambit_bb132__20_ps();
  }
}

function gambit_bb79__20_ps() {
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb66__20_ps() { // return-point
  gambit_r2 = gambit_cst__20_ps[57];
  gambit_r0 = gambit_bb67__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-3]();
}

gambit_bb66__20_ps.id = 110;
gambit_bb66__20_ps.parent = gambit_bb1__20_ps;
gambit_bb66__20_ps.fs = 5;
gambit_bb66__20_ps.link = 1;

function gambit_bb252__20_ps() { // return-point
  gambit_stack[gambit_sp-1] = gambit_r1;
  if (gambit_stack[gambit_sp] === 0) {
    gambit_r2 = gambit_cst__20_ps[57];
    return gambit_bb255__20_ps();
  } else {
    gambit_r2 = gambit_stack[gambit_sp];
    return gambit_bb255__20_ps();
  }
}

gambit_bb252__20_ps.id = 111;
gambit_bb252__20_ps.parent = gambit_bb1__20_ps;
gambit_bb252__20_ps.fs = 8;
gambit_bb252__20_ps.link = 3;

function gambit_bb179__20_ps() { // return-point
  if (gambit_r1 === false) {
    gambit_r1 = gambit_stack[gambit_sp-1];
    return gambit_bb181__20_ps();
  } else {
    if (gambit_stack[gambit_sp-2] === false) {
      gambit_r1 = 15;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb185__20_ps);
      } else {
        return gambit_bb185__20_ps();
      }
    } else {
      gambit_r1 = 100;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb187__20_ps);
      } else {
        return gambit_bb187__20_ps();
      }
    }
  }
}

gambit_bb179__20_ps.id = 112;
gambit_bb179__20_ps.parent = gambit_bb1__20_ps;
gambit_bb179__20_ps.fs = 4;
gambit_bb179__20_ps.link = 1;

function gambit_bb176__20_ps() {
  gambit_r2 = gambit_r1.cdr;
  if (gambit_r2 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.cdr;
    gambit_r2 = gambit_r2.car;
    gambit_r3 = gambit_r1.car;
    gambit_r3 = gambit_r3 + 1;
    if (gambit_r3 === gambit_r2) {
      gambit_r1 = gambit_r1.cdr;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb175__20_ps);
      } else {
        return gambit_bb175__20_ps();
      }
    } else {
      gambit_r1 = false;
      return gambit_r0;
    }
  } else {
    gambit_r1 = true;
    return gambit_r0;
  }
}

function gambit_bb182__20_ps() {
  gambit_r1 = true;
  return gambit_r0;
}

function gambit_bb181__20_ps() {
  gambit_stack[gambit_sp-1] = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb188__20_ps;
  if (gambit_r1 instanceof Gambit_Pair) {
    --gambit_sp;
    return gambit_bb176__20_ps();
  } else {
    --gambit_sp;
    return gambit_bb182__20_ps();
  }
}

function gambit_bb154__20_ps() {
  if (gambit_r3 instanceof Gambit_Pair) {
    gambit_r4 = gambit_r3.car;
    if (gambit_r1 === gambit_r4) {
      gambit_r2 = gambit_r2 + 1;
      gambit_r3 = gambit_r3.cdr;
      if (gambit_r3 instanceof Gambit_Pair) {
        gambit_r4 = gambit_r3.car;
        if (gambit_r1 === gambit_r4) {
          gambit_r3 = gambit_r3.cdr;
          gambit_r2 = gambit_r2 + 1;
          if (--gambit_pollcount === 0) {
            return gambit_poll(gambit_bb154__20_ps);
          } else {
            return gambit_bb154__20_ps();
          }
        } else {
          return gambit_bb158__20_ps();
        }
      } else {
        return gambit_bb158__20_ps();
      }
    } else {
      return gambit_bb161__20_ps();
    }
  } else {
    return gambit_bb161__20_ps();
  }
}

function gambit_bb166__20_ps() {
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r3 = gambit_r1.cdr;
    gambit_r1 = gambit_r1.car;
    gambit_r1 = new Gambit_Pair(gambit_r1,gambit_r2);
    if (gambit_r3 instanceof Gambit_Pair) {
      gambit_r2 = gambit_r3.cdr;
      gambit_r3 = gambit_r3.car;
      gambit_r1 = new Gambit_Pair(gambit_r3,gambit_r1);
      if (gambit_r2 instanceof Gambit_Pair) {
        gambit_r3 = gambit_r2.car;
        gambit_r1 = new Gambit_Pair(gambit_r3,gambit_r1);
        gambit_stack[gambit_sp+1] = gambit_r2;
        gambit_r2 = gambit_r1;
        gambit_r1 = gambit_stack[gambit_sp+1].cdr;
        if (--gambit_pollcount === 0) {
          return gambit_poll(gambit_bb166__20_ps);
        } else {
          return gambit_bb166__20_ps();
        }
      } else {
        return gambit_r0;
      }
    } else {
      return gambit_r0;
    }
  } else {
    gambit_r1 = gambit_r2;
    return gambit_r0;
  }
}

function gambit_bb136__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp].cdr;
  gambit_r0 = gambit_bb138__20_ps;
  if (gambit_r1 === null) {
    ++gambit_sp;
    return gambit_r0;
  } else {
    ++gambit_sp;
    return gambit_bb132__20_ps();
  }
}

gambit_bb136__20_ps.id = 113;
gambit_bb136__20_ps.parent = gambit_bb1__20_ps;
gambit_bb136__20_ps.fs = 2;
gambit_bb136__20_ps.link = 1;

function gambit_bb132__20_ps() {
  gambit_r2 = gambit_r1.cdr;
  if (gambit_r2 === null) {
    return gambit_r0;
  } else {
    gambit_stack[gambit_sp+1] = gambit_r0;
    gambit_stack[gambit_sp+2] = gambit_r1;
    gambit_r1 = gambit_r1.cdr.cdr;
    gambit_r0 = gambit_bb134__20_ps;
    (gambit_sp += 2);
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb131__20_ps);
    } else {
      return gambit_bb131__20_ps();
    }
  }
}

function gambit_bb67__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb68__20_ps;
  if (typeof gambit_r1 === "number") {
    --gambit_sp;
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    --gambit_sp;
    return gambit_bb62__20_ps();
  }
}

gambit_bb67__20_ps.id = 114;
gambit_bb67__20_ps.parent = gambit_bb1__20_ps;
gambit_bb67__20_ps.fs = 5;
gambit_bb67__20_ps.link = 1;

function gambit_bb255__20_ps() {
  gambit_r0 = gambit_bb256__20_ps;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_nargs = 2;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp-4]();
}

function gambit_bb185__20_ps() {
  (gambit_sp -= 4);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb187__20_ps() {
  (gambit_sp -= 4);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb175__20_ps() {
  if (gambit_r1 instanceof Gambit_Pair) {
    return gambit_bb176__20_ps();
  } else {
    return gambit_bb182__20_ps();
  }
}

function gambit_bb188__20_ps() { // return-point
  if (gambit_r1 === false) {
    if (gambit_stack[gambit_sp-1] === false) {
      gambit_r1 = gambit_stack[gambit_sp].car;
      gambit_r1 = gambit_r1.cdr;
      if (gambit_r1 === 4) {
        return gambit_bb192__20_ps();
      } else {
        gambit_r1 = gambit_stack[gambit_sp].cdr.car;
        gambit_r1 = gambit_r1.cdr;
        if (gambit_r1 === 4) {
          return gambit_bb192__20_ps();
        } else {
          gambit_r1 = gambit_stack[gambit_sp].car;
          gambit_r1 = gambit_r1.cdr;
          if (gambit_r1 === 3) {
            gambit_r1 = gambit_stack[gambit_sp].cdr.car;
            gambit_r1 = gambit_r1.cdr;
            if (gambit_r1 === 2) {
              return gambit_bb198__20_ps();
            } else {
              return gambit_bb196__20_ps();
            }
          } else {
            return gambit_bb196__20_ps();
          }
        }
      }
    } else {
      gambit_r1 = 20;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb222__20_ps);
      } else {
        return gambit_bb222__20_ps();
      }
    }
  } else {
    if (gambit_stack[gambit_sp-1] === false) {
      gambit_r1 = 15;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb225__20_ps);
      } else {
        return gambit_bb225__20_ps();
      }
    } else {
      gambit_r1 = 75;
      if (--gambit_pollcount === 0) {
        return gambit_poll(gambit_bb227__20_ps);
      } else {
        return gambit_bb227__20_ps();
      }
    }
  }
}

gambit_bb188__20_ps.id = 115;
gambit_bb188__20_ps.parent = gambit_bb1__20_ps;
gambit_bb188__20_ps.fs = 3;
gambit_bb188__20_ps.link = 1;

function gambit_bb158__20_ps() {
  gambit_r1 = new Gambit_Pair(gambit_r1,gambit_r2);
  gambit_r1 = new Gambit_Pair(gambit_r1,gambit_stack[gambit_sp]);
  gambit_r2 = gambit_r3;
  --gambit_sp;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb159__20_ps);
  } else {
    return gambit_bb159__20_ps();
  }
}

function gambit_bb161__20_ps() {
  gambit_r1 = new Gambit_Pair(gambit_r1,gambit_r2);
  gambit_r1 = new Gambit_Pair(gambit_r1,gambit_stack[gambit_sp]);
  gambit_r2 = gambit_r3;
  --gambit_sp;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb159__20_ps);
  } else {
    return gambit_bb159__20_ps();
  }
}

function gambit_bb138__20_ps() { // return-point
  gambit_r0 = gambit_bb140__20_ps;
  if (gambit_r1 === null) {
    return gambit_r0;
  } else {
    return gambit_bb129__20_ps();
  }
}

gambit_bb138__20_ps.id = 116;
gambit_bb138__20_ps.parent = gambit_bb1__20_ps;
gambit_bb138__20_ps.fs = 3;
gambit_bb138__20_ps.link = 1;

function gambit_bb134__20_ps() { // return-point
  gambit_r2 = gambit_stack[gambit_sp].car;
  gambit_r1 = new Gambit_Pair(gambit_r2,gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb135__20_ps);
  } else {
    return gambit_bb135__20_ps();
  }
}

gambit_bb134__20_ps.id = 117;
gambit_bb134__20_ps.parent = gambit_bb1__20_ps;
gambit_bb134__20_ps.fs = 2;
gambit_bb134__20_ps.link = 1;

function gambit_bb68__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[62];
  gambit_r0 = gambit_bb69__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-1]();
}

gambit_bb68__20_ps.id = 118;
gambit_bb68__20_ps.parent = gambit_bb1__20_ps;
gambit_bb68__20_ps.fs = 4;
gambit_bb68__20_ps.link = 1;

function gambit_bb256__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp].cdr;
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.car;
    gambit_stack[gambit_sp] = gambit_r1;
    gambit_stack[gambit_sp+1] = gambit_r2;
    gambit_r1 = gambit_stack[gambit_sp-5];
    gambit_r3 = 5;
    gambit_r0 = gambit_bb95__20_ps;
    ++gambit_sp;
    return gambit_bb84__20_ps();
  } else {
    gambit_r1 = undefined;
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb259__20_ps);
    } else {
      return gambit_bb259__20_ps();
    }
  }
}

gambit_bb256__20_ps.id = 119;
gambit_bb256__20_ps.parent = gambit_bb1__20_ps;
gambit_bb256__20_ps.fs = 6;
gambit_bb256__20_ps.link = 3;

function gambit_bb192__20_ps() {
  gambit_r1 = 50;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb193__20_ps);
  } else {
    return gambit_bb193__20_ps();
  }
}

function gambit_bb198__20_ps() {
  gambit_r1 = 25;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb199__20_ps);
  } else {
    return gambit_bb199__20_ps();
  }
}

function gambit_bb196__20_ps() {
  gambit_r1 = gambit_stack[gambit_sp].car;
  gambit_r1 = gambit_r1.cdr;
  if (gambit_r1 === 2) {
    gambit_r1 = gambit_stack[gambit_sp].cdr.car;
    gambit_r1 = gambit_r1.cdr;
    if (gambit_r1 === 3) {
      return gambit_bb198__20_ps();
    } else {
      return gambit_bb200__20_ps();
    }
  } else {
    return gambit_bb200__20_ps();
  }
}

function gambit_bb222__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb225__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb227__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb159__20_ps() {
  if (gambit_r2 instanceof Gambit_Pair) {
    return gambit_bb160__20_ps();
  } else {
    return gambit_bb162__20_ps();
  }
}

function gambit_bb140__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_stack[gambit_sp-2];
  (gambit_sp -= 3);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb144__20_ps);
  } else {
    return gambit_bb144__20_ps();
  }
}

gambit_bb140__20_ps.id = 120;
gambit_bb140__20_ps.parent = gambit_bb1__20_ps;
gambit_bb140__20_ps.fs = 3;
gambit_bb140__20_ps.link = 1;

function gambit_bb135__20_ps() {
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb69__20_ps() { // return-point
  gambit_r2 = gambit_cst__20_ps[57];
  gambit_r0 = gambit_bb70__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-2]();
}

gambit_bb69__20_ps.id = 121;
gambit_bb69__20_ps.parent = gambit_bb1__20_ps;
gambit_bb69__20_ps.fs = 4;
gambit_bb69__20_ps.link = 1;

function gambit_bb95__20_ps() { // return-point
  gambit_r0 = gambit_bb228__20_ps;
  return gambit_bb96__20_ps();
}

gambit_bb95__20_ps.id = 122;
gambit_bb95__20_ps.parent = gambit_bb1__20_ps;
gambit_bb95__20_ps.fs = 7;
gambit_bb95__20_ps.link = 3;

function gambit_bb259__20_ps() {
  (gambit_sp -= 6);
  return gambit_stack[gambit_sp+3]();
}

function gambit_bb193__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb199__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb200__20_ps() {
  gambit_r1 = gambit_stack[gambit_sp].car;
  gambit_r1 = gambit_r1.cdr;
  if (gambit_r1 === 3) {
    return gambit_bb203__20_ps();
  } else {
    gambit_r1 = gambit_stack[gambit_sp].cdr.car;
    gambit_r1 = gambit_r1.cdr;
    if (gambit_r1 === 3) {
      return gambit_bb203__20_ps();
    } else {
      gambit_r1 = gambit_stack[gambit_sp].cdr.cdr.car;
      gambit_r1 = gambit_r1.cdr;
      if (gambit_r1 === 3) {
        return gambit_bb203__20_ps();
      } else {
        gambit_r1 = gambit_stack[gambit_sp].car;
        gambit_r1 = gambit_r1.cdr;
        if (gambit_r1 === 2) {
          gambit_r1 = gambit_stack[gambit_sp].cdr.car;
          gambit_r1 = gambit_r1.cdr;
          if (gambit_r1 === 2) {
            return gambit_bb211__20_ps();
          } else {
            return gambit_bb207__20_ps();
          }
        } else {
          return gambit_bb207__20_ps();
        }
      }
    }
  }
}

function gambit_bb144__20_ps() {
  if (gambit_r1 === null) {
    gambit_r1 = gambit_r2;
    return gambit_r0;
  } else {
    if (gambit_r2 === null) {
      return gambit_r0;
    } else {
      gambit_r3 = gambit_r2.car;
      gambit_r4 = gambit_r1.car;
      if (gambit_r4 < gambit_r3) {
        gambit_stack[gambit_sp+1] = gambit_r0;
        gambit_stack[gambit_sp+2] = gambit_r4;
        gambit_r1 = gambit_r1.cdr;
        gambit_r0 = gambit_bb148__20_ps;
        (gambit_sp += 2);
        if (--gambit_pollcount === 0) {
          return gambit_poll(gambit_bb144__20_ps);
        } else {
          return gambit_bb144__20_ps();
        }
      } else {
        gambit_stack[gambit_sp+1] = gambit_r0;
        gambit_stack[gambit_sp+2] = gambit_r3;
        gambit_r2 = gambit_r2.cdr;
        gambit_r0 = gambit_bb150__20_ps;
        (gambit_sp += 2);
        if (--gambit_pollcount === 0) {
          return gambit_poll(gambit_bb144__20_ps);
        } else {
          return gambit_bb144__20_ps();
        }
      }
    }
  }
}

function gambit_bb70__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp].cdr;
  if (gambit_r1 instanceof Gambit_Pair) {
    gambit_r2 = gambit_r1.car;
    gambit_stack[gambit_sp] = gambit_r1;
    gambit_stack[gambit_sp+1] = gambit_r2;
    gambit_r1 = gambit_r2;
    gambit_r0 = gambit_bb72__20_ps;
    if (typeof gambit_r1 === "number") {
      ++gambit_sp;
      if (gambit_r1 < 0) {
        return gambit_bb51__20_ps();
      } else {
        return gambit_bb60__20_ps();
      }
    } else {
      ++gambit_sp;
      return gambit_bb62__20_ps();
    }
  } else {
    gambit_r1 = undefined;
    if (--gambit_pollcount === 0) {
      return gambit_poll(gambit_bb75__20_ps);
    } else {
      return gambit_bb75__20_ps();
    }
  }
}

gambit_bb70__20_ps.id = 123;
gambit_bb70__20_ps.parent = gambit_bb1__20_ps;
gambit_bb70__20_ps.fs = 4;
gambit_bb70__20_ps.link = 1;

function gambit_bb228__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r2 = gambit_stack[gambit_sp] * 5;
  gambit_r1 = gambit_stack[gambit_sp-6];
  gambit_r3 = 1;
  gambit_r0 = gambit_bb229__20_ps;
  ++gambit_sp;
  return gambit_bb84__20_ps();
}

gambit_bb228__20_ps.id = 124;
gambit_bb228__20_ps.parent = gambit_bb1__20_ps;
gambit_bb228__20_ps.fs = 7;
gambit_bb228__20_ps.link = 3;

function gambit_bb203__20_ps() {
  gambit_r1 = 10;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb204__20_ps);
  } else {
    return gambit_bb204__20_ps();
  }
}

function gambit_bb211__20_ps() {
  gambit_r1 = 5;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb212__20_ps);
  } else {
    return gambit_bb212__20_ps();
  }
}

function gambit_bb207__20_ps() {
  gambit_r1 = gambit_stack[gambit_sp].car;
  gambit_r1 = gambit_r1.cdr;
  if (gambit_r1 === 2) {
    gambit_r1 = gambit_stack[gambit_sp].cdr.cdr.car;
    gambit_r1 = gambit_r1.cdr;
    if (gambit_r1 === 2) {
      return gambit_bb211__20_ps();
    } else {
      return gambit_bb209__20_ps();
    }
  } else {
    return gambit_bb209__20_ps();
  }
}

function gambit_bb148__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb149__20_ps);
  } else {
    return gambit_bb149__20_ps();
  }
}

gambit_bb148__20_ps.id = 125;
gambit_bb148__20_ps.parent = gambit_bb1__20_ps;
gambit_bb148__20_ps.fs = 2;
gambit_bb148__20_ps.link = 1;

function gambit_bb150__20_ps() { // return-point
  gambit_r1 = new Gambit_Pair(gambit_stack[gambit_sp],gambit_r1);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb151__20_ps);
  } else {
    return gambit_bb151__20_ps();
  }
}

gambit_bb150__20_ps.id = 126;
gambit_bb150__20_ps.parent = gambit_bb1__20_ps;
gambit_bb150__20_ps.fs = 2;
gambit_bb150__20_ps.link = 1;

function gambit_bb72__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[60];
  gambit_r0 = gambit_bb73__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-2]();
}

gambit_bb72__20_ps.id = 127;
gambit_bb72__20_ps.parent = gambit_bb1__20_ps;
gambit_bb72__20_ps.fs = 5;
gambit_bb72__20_ps.link = 1;

function gambit_bb75__20_ps() {
  (gambit_sp -= 4);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb229__20_ps() { // return-point
  gambit_r0 = gambit_bb230__20_ps;
  return gambit_bb96__20_ps();
}

gambit_bb229__20_ps.id = 128;
gambit_bb229__20_ps.parent = gambit_bb1__20_ps;
gambit_bb229__20_ps.fs = 8;
gambit_bb229__20_ps.link = 3;

function gambit_bb204__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb212__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb209__20_ps() {
  gambit_r1 = gambit_stack[gambit_sp].cdr.car;
  gambit_r1 = gambit_r1.cdr;
  if (gambit_r1 === 2) {
    gambit_r1 = gambit_stack[gambit_sp].cdr.cdr.car;
    gambit_r1 = gambit_r1.cdr;
    if (gambit_r1 === 2) {
      return gambit_bb211__20_ps();
    } else {
      return gambit_bb213__20_ps();
    }
  } else {
    return gambit_bb213__20_ps();
  }
}

function gambit_bb149__20_ps() {
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb151__20_ps() {
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb73__20_ps() { // return-point
  gambit_r2 = gambit_cst__20_ps[57];
  gambit_r0 = gambit_bb61__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-3]();
}

gambit_bb73__20_ps.id = 129;
gambit_bb73__20_ps.parent = gambit_bb1__20_ps;
gambit_bb73__20_ps.fs = 5;
gambit_bb73__20_ps.link = 1;

function gambit_bb230__20_ps() { // return-point
  gambit_r2 = gambit_r1 + gambit_stack[gambit_sp];
  gambit_r3 = gambit_stack[gambit_sp-3].val;
  gambit_r2 = gambit_r3 + gambit_r2;
  gambit_stack[gambit_sp-3].val = gambit_r2;
  gambit_stack[gambit_sp+1] = gambit_r1;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_bb231__20_ps;
  if (typeof gambit_r1 === "number") {
    ++gambit_sp;
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    ++gambit_sp;
    return gambit_bb62__20_ps();
  }
}

gambit_bb230__20_ps.id = 130;
gambit_bb230__20_ps.parent = gambit_bb1__20_ps;
gambit_bb230__20_ps.fs = 8;
gambit_bb230__20_ps.link = 3;

function gambit_bb213__20_ps() {
  gambit_r1 = gambit_stack[gambit_sp].car;
  gambit_r1 = gambit_r1.cdr;
  if (gambit_r1 === 2) {
    return gambit_bb217__20_ps();
  } else {
    gambit_r1 = gambit_stack[gambit_sp].cdr.car;
    gambit_r1 = gambit_r1.cdr;
    if (gambit_r1 === 2) {
      return gambit_bb217__20_ps();
    } else {
      gambit_r1 = gambit_stack[gambit_sp].cdr.cdr.car;
      gambit_r1 = gambit_r1.cdr;
      if (gambit_r1 === 2) {
        return gambit_bb217__20_ps();
      } else {
        gambit_r1 = gambit_stack[gambit_sp].cdr.cdr.cdr.car;
        gambit_r1 = gambit_r1.cdr;
        if (gambit_r1 === 2) {
          return gambit_bb217__20_ps();
        } else {
          gambit_r1 = 0;
          if (--gambit_pollcount === 0) {
            return gambit_poll(gambit_bb220__20_ps);
          } else {
            return gambit_bb220__20_ps();
          }
        }
      }
    }
  }
}

function gambit_bb61__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_r0 = gambit_bb63__20_ps;
  if (typeof gambit_r1 === "number") {
    --gambit_sp;
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    --gambit_sp;
    return gambit_bb62__20_ps();
  }
}

gambit_bb61__20_ps.id = 131;
gambit_bb61__20_ps.parent = gambit_bb1__20_ps;
gambit_bb61__20_ps.fs = 5;
gambit_bb61__20_ps.link = 1;

function gambit_bb231__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[56];
  gambit_r0 = gambit_bb232__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-5]();
}

gambit_bb231__20_ps.id = 132;
gambit_bb231__20_ps.parent = gambit_bb1__20_ps;
gambit_bb231__20_ps.fs = 9;
gambit_bb231__20_ps.link = 3;

function gambit_bb217__20_ps() {
  gambit_r1 = 2;
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb218__20_ps);
  } else {
    return gambit_bb218__20_ps();
  }
}

function gambit_bb220__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb63__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[62];
  gambit_r0 = gambit_bb64__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-1]();
}

gambit_bb63__20_ps.id = 133;
gambit_bb63__20_ps.parent = gambit_bb1__20_ps;
gambit_bb63__20_ps.fs = 4;
gambit_bb63__20_ps.link = 1;

function gambit_bb232__20_ps() { // return-point
  gambit_stack[gambit_sp+1] = gambit_r1;
  if (gambit_stack[gambit_sp] === 0) {
    ++gambit_sp;
    gambit_r2 = gambit_cst__20_ps[57];
    return gambit_bb235__20_ps();
  } else {
    ++gambit_sp;
    gambit_r2 = gambit_stack[gambit_sp-1];
    return gambit_bb235__20_ps();
  }
}

gambit_bb232__20_ps.id = 134;
gambit_bb232__20_ps.parent = gambit_bb1__20_ps;
gambit_bb232__20_ps.fs = 9;
gambit_bb232__20_ps.link = 3;

function gambit_bb218__20_ps() {
  (gambit_sp -= 3);
  return gambit_stack[gambit_sp+1]();
}

function gambit_bb64__20_ps() { // return-point
  gambit_r2 = gambit_cst__20_ps[57];
  gambit_r0 = gambit_bb46__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-2]();
}

gambit_bb64__20_ps.id = 135;
gambit_bb64__20_ps.parent = gambit_bb1__20_ps;
gambit_bb64__20_ps.fs = 4;
gambit_bb64__20_ps.link = 1;

function gambit_bb235__20_ps() {
  gambit_r0 = gambit_bb236__20_ps;
  gambit_r1 = gambit_stack[gambit_sp];
  gambit_nargs = 2;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp-6]();
}

function gambit_bb46__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp].cdr;
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_stack[gambit_sp-3];
  (gambit_sp -= 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb47__20_ps);
  } else {
    return gambit_bb47__20_ps();
  }
}

gambit_bb46__20_ps.id = 136;
gambit_bb46__20_ps.parent = gambit_bb1__20_ps;
gambit_bb46__20_ps.fs = 4;
gambit_bb46__20_ps.link = 1;

function gambit_bb236__20_ps() { // return-point
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_r0 = gambit_bb237__20_ps;
  if (typeof gambit_r1 === "number") {
    if (gambit_r1 < 0) {
      return gambit_bb51__20_ps();
    } else {
      return gambit_bb60__20_ps();
    }
  } else {
    return gambit_bb62__20_ps();
  }
}

gambit_bb236__20_ps.id = 137;
gambit_bb236__20_ps.parent = gambit_bb1__20_ps;
gambit_bb236__20_ps.fs = 8;
gambit_bb236__20_ps.link = 3;

function gambit_bb47__20_ps() {
  if (gambit_r3 instanceof Gambit_Pair) {
    return gambit_bb48__20_ps();
  } else {
    return gambit_bb76__20_ps();
  }
}

function gambit_bb237__20_ps() { // return-point
  gambit_r2 = gambit_r1;
  gambit_r1 = gambit_cst__20_ps[61];
  gambit_r0 = gambit_bb238__20_ps;
  gambit_nargs = 2;
  return gambit_stack[gambit_sp-4]();
}

gambit_bb237__20_ps.id = 138;
gambit_bb237__20_ps.parent = gambit_bb1__20_ps;
gambit_bb237__20_ps.fs = 8;
gambit_bb237__20_ps.link = 3;

function gambit_bb238__20_ps() { // return-point
  gambit_stack[gambit_sp-1] = gambit_r1;
  if (gambit_stack[gambit_sp] === 0) {
    gambit_r2 = gambit_cst__20_ps[57];
    return gambit_bb241__20_ps();
  } else {
    gambit_r2 = gambit_stack[gambit_sp];
    return gambit_bb241__20_ps();
  }
}

gambit_bb238__20_ps.id = 139;
gambit_bb238__20_ps.parent = gambit_bb1__20_ps;
gambit_bb238__20_ps.fs = 8;
gambit_bb238__20_ps.link = 3;

function gambit_bb241__20_ps() {
  gambit_r0 = gambit_bb81__20_ps;
  gambit_r1 = gambit_stack[gambit_sp-1];
  gambit_nargs = 2;
  (gambit_sp -= 2);
  return gambit_stack[gambit_sp-4]();
}

function gambit_bb81__20_ps() { // return-point
  gambit_r3 = gambit_stack[gambit_sp].cdr;
  gambit_r2 = gambit_stack[gambit_sp-1];
  gambit_r1 = gambit_stack[gambit_sp-2];
  gambit_r0 = gambit_stack[gambit_sp-3];
  (gambit_sp -= 4);
  if (--gambit_pollcount === 0) {
    return gambit_poll(gambit_bb82__20_ps);
  } else {
    return gambit_bb82__20_ps();
  }
}

gambit_bb81__20_ps.id = 140;
gambit_bb81__20_ps.parent = gambit_bb1__20_ps;
gambit_bb81__20_ps.fs = 6;
gambit_bb81__20_ps.link = 3;

function gambit_bb82__20_ps() {
  if (gambit_r3 instanceof Gambit_Pair) {
    return gambit_bb83__20_ps();
  } else {
    return gambit_bb260__20_ps();
  }
}

gambit_bb1__20_ps.subprocs = [gambit_bb1__20_ps,gambit_bb445__20_ps,gambit_bb306__20_ps,gambit_bb5__20_ps,gambit_bb3__20_ps,gambit_bb429__20_ps,gambit_bb307__20_ps,gambit_bb305__20_ps,gambit_bb276__20_ps,gambit_bb279__20_ps,gambit_bb304__20_ps,gambit_bb434__20_ps,gambit_bb439__20_ps,gambit_bb443__20_ps,gambit_bb421__20_ps,gambit_bb394__20_ps,gambit_bb309__20_ps,gambit_bb20__20_ps,gambit_bb28__20_ps,gambit_bb24__20_ps,gambit_bb32__20_ps,gambit_bb80__20_ps,gambit_bb295__20_ps,gambit_bb463__20_ps,gambit_bb470__20_ps,gambit_bb435__20_ps,gambit_bb440__20_ps,gambit_bb424__20_ps,gambit_bb395__20_ps,gambit_bb363__20_ps,gambit_bb29__20_ps,gambit_bb261__20_ps,gambit_bb301__20_ps,gambit_bb294__20_ps,gambit_bb58__20_ps,gambit_bb425__20_ps,gambit_bb396__20_ps,gambit_bb374__20_ps,gambit_bb373__20_ps,gambit_bb379__20_ps,gambit_bb381__20_ps,gambit_bb383__20_ps,gambit_bb385__20_ps,gambit_bb387__20_ps,gambit_bb389__20_ps,gambit_bb391__20_ps,gambit_bb393__20_ps,gambit_bb314__20_ps,gambit_bb39__20_ps,gambit_bb30__20_ps,gambit_bb262__20_ps,gambit_bb94__20_ps,gambit_bb300__20_ps,gambit_bb286__20_ps,gambit_bb291__20_ps,gambit_bb57__20_ps,gambit_bb397__20_ps,gambit_bb329__20_ps,gambit_bb268__20_ps,gambit_bb264__20_ps,gambit_bb242__20_ps,gambit_bb33__20_ps,gambit_bb287__20_ps,gambit_bb411__20_ps,gambit_bb340__20_ps,gambit_bb339__20_ps,gambit_bb344__20_ps,gambit_bb346__20_ps,gambit_bb348__20_ps,gambit_bb350__20_ps,gambit_bb352__20_ps,gambit_bb354__20_ps,gambit_bb356__20_ps,gambit_bb358__20_ps,gambit_bb269__20_ps,gambit_bb243__20_ps,gambit_bb105__20_ps,gambit_bb412__20_ps,gambit_bb400__20_ps,gambit_bb321__20_ps,gambit_bb270__20_ps,gambit_bb244__20_ps,gambit_bb114__20_ps,gambit_bb281__20_ps,gambit_bb398__20_ps,gambit_bb310__20_ps,gambit_bb327__20_ps,gambit_bb271__20_ps,gambit_bb245__20_ps,gambit_bb123__20_ps,gambit_bb43__20_ps,gambit_bb416__20_ps,gambit_bb409__20_ps,gambit_bb406__20_ps,gambit_bb361__20_ps,gambit_bb323__20_ps,gambit_bb246__20_ps,gambit_bb119__20_ps,gambit_bb45__20_ps,gambit_bb413__20_ps,gambit_bb124__20_ps,gambit_bb121__20_ps,gambit_bb77__20_ps,gambit_bb250__20_ps,gambit_bb152__20_ps,gambit_bb78__20_ps,gambit_bb65__20_ps,gambit_bb251__20_ps,gambit_bb170__20_ps,gambit_bb128__20_ps,gambit_bb66__20_ps,gambit_bb252__20_ps,gambit_bb179__20_ps,gambit_bb136__20_ps,gambit_bb67__20_ps,gambit_bb188__20_ps,gambit_bb138__20_ps,gambit_bb134__20_ps,gambit_bb68__20_ps,gambit_bb256__20_ps,gambit_bb140__20_ps,gambit_bb69__20_ps,gambit_bb95__20_ps,gambit_bb70__20_ps,gambit_bb228__20_ps,gambit_bb148__20_ps,gambit_bb150__20_ps,gambit_bb72__20_ps,gambit_bb229__20_ps,gambit_bb73__20_ps,gambit_bb230__20_ps,gambit_bb61__20_ps,gambit_bb231__20_ps,gambit_bb63__20_ps,gambit_bb232__20_ps,gambit_bb64__20_ps,gambit_bb46__20_ps,gambit_bb236__20_ps,gambit_bb237__20_ps,gambit_bb238__20_ps,gambit_bb81__20_ps];

gambit_prm[" ps"] = gambit_bb1__20_ps;
gambit_glo[" ps"] = gambit_bb1__20_ps;

// --------------------------------

gambit_current_thread = new Gambit_Structure([false,false,false,false,false,false,null,false,false,false,false,false,0]);
gambit_stack[++gambit_sp] = false;
gambit_r0 = gambit_underflow;
gambit_nargs = 0;
gambit_trampoline(gambit_bb1__20_ps);
