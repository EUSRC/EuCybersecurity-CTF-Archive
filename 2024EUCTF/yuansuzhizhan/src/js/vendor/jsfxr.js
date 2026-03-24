/**
 * SfxrParams
 *
 * 版权所有 2010 Thomas Vian
 *
 * 根据 Apache 许可证 2.0 版（“许可证”）授权；
 * 除非遵循许可证，否则您不得使用此文件。
 * 您可以在以下网址获取许可证：
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * 除非适用法律要求或书面同意，否则以"按原样"基础分发该软件，不提供任何形式的保证或条件。
 * 有关许可证下特定语言的权限和限制，请参阅许可证。
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  设置字符串方法
  //
  //--------------------------------------------------------------------------

  /**
   * 将设置数组解析为参数
   * @param array 设置值的数组，元素 0 - 23 为
   *                a: waveType（波形类型）
   *                b: attackTime（攻击时间）
   *                c: sustainTime（持续时间）
   *                d: sustainPunch（持续冲击）
   *                e: decayTime（衰减时间）
   *                f: startFrequency（起始频率）
   *                g: minFrequency（最小频率）
   *                h: slide（滑音）
   *                i: deltaSlide（滑音变化）
   *                j: vibratoDepth（颤音深度）
   *                k: vibratoSpeed（颤音速度）
   *                l: changeAmount（变化量）
   *                m: changeSpeed（变化速度）
   *                n: squareDuty（方波占空比）
   *                o: dutySweep（占空比扫频）
   *                p: repeatSpeed（重复速度）
   *                q: phaserOffset（相位偏移）
   *                r: phaserSweep（相位扫频）
   *                s: lpFilterCutoff（低通滤波器截止频率）
   *                t: lpFilterCutoffSweep（低通滤波器截止频率扫频）
   *                u: lpFilterResonance（低通滤波器共振）
   *                v: hpFilterCutoff（高通滤波器截止频率）
   *                w: hpFilterCutoffSweep（高通滤波器截止频率扫频）
   *                x: masterVolume（主音量）
   * @return 如果字符串成功解析返回 true
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      // 将设置值赋给对应的参数，未定义则默认为 0
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // 将持续时间 c 的最小值设为 0.01
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    // 计算总时间，并确保不小于 0.18
    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * 版权所有 2010 Thomas Vian
 *
 * 根据 Apache 许可证 2.0 版（“许可证”）授权；
 * 除非遵循许可证，否则您不得使用此文件。
 * 您可以在以下网址获取许可证：
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * 除非适用法律要求或书面同意，否则以"按原样"基础分发该软件，不提供任何形式的保证或条件。
 * 有关许可证下特定语言的权限和限制，请参阅许可证。
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // 所有变量通过函数闭包保持活跃

  //--------------------------------------------------------------------------
  //
  //  声音参数
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // 参数实例

  //--------------------------------------------------------------------------
  //
  //  合成器变量
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // 攻击阶段的长度
      _envelopeLength1, // 持续阶段的长度
      _envelopeLength2, // 衰减阶段的长度

      _period,          // 波的周期
      _maxPeriod,       // 声音停止前的最大周期（来自最小频率）

      _slide,           // 音符滑音
      _deltaSlide,      // 滑音的变化量

      _changeAmount,    // 改变音调的量
      _changeTime,      // 音调变化的计数器
      _changeLimit,     // 一旦时间达到这个限制，音调会发生变化

      _squareDuty,      // 方波中心开关点的偏移
      _dutySweep;       // 占空比变化的量

  //--------------------------------------------------------------------------
  //
  //  合成器方法
  //
  //--------------------------------------------------------------------------

  /**
   * 重置运行变量
   * 在开始时使用（完全重置）以及用于重复效果（部分重置）
   */
  this.reset = function() {
    // 短引用
    var p = this._params;

    // 计算周期和最大周期
    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    // 计算滑音和滑音变化量
    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    // 如果不是方波，计算占空比及其变化
    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    // 计算音调变化量和限制
    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // 将 reset() 函数分为两个函数以提高可读性
  this.totalReset = function() {
    this.reset();

    // 短引用
    var p = this._params;

    // 计算音量包络的长度
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // 全音量包络（因此声音）的总长度
    // 确保长度可以被 3 整除，以便我们在 Base64 编码后不需要填充 "=="
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * 将波写入提供的缓冲区 ByteArray
   * @param buffer 要写入波形的 ByteArray
   * @return 如果波形已完成返回 true
   */
  this.synthWave = function(buffer, length) {
    // 短引用
    var p = this._params;

    // 如果滤波器处于活动状态
    var _filters = p['s'] != 1 || p['v'],
        // 高通滤波器截止频率的乘数
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // 高通滤波器截止频率的变化速度
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // 低通滤波器截止频率的乘数
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // 低通滤波器截止频率的变化速度
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // 低通滤波器是否激活
        _lpFilterOn = p['s'] != 1,
        // 主音量的平方（用于快速计算）
        _masterVolume = p['x'] * p['x'],
        // 停止前的最小频率
        _minFreqency = p['g'],
        // 相位效果是否激活
        _phaser = p['q'] || p['r'],
        // 相位偏移的变化量
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // 相位偏移量
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // 一旦时间达到这个限制，一些变量会被重置
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // 冲击因子（在持续阶段开始时更响）
        _sustainPunch = p['d'],
        // 在颤音波峰处改变波周期的量
        _vibratoAmplitude = p['j'] / 2,
        // 颤音相位移动的速度
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // 生成的波形类型
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // 当前包络阶段的长度
        _envelopeOverLength0 = 1 / _envelopeLength0, // （用于快速计算）
        _envelopeOverLength1 = 1 / _envelopeLength1, // （用于快速计算）
        _envelopeOverLength2 = 1 / _envelopeLength2; // （用于快速计算）

    // 阻尼倍增器，限制波形位置移动的速度
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // 声音是否结束
        _envelopeStage    = 0, // 当前包络阶段（攻击、持续、衰减、结束）
        _envelopeTime     = 0, // 当前在包络阶段的时间
        _envelopeVolume   = 0, // 当前包络的音量
        _hpFilterPos      = 0, // 高通滤波器后调整的波形位置
        _lpFilterDeltaPos = 0, // 低通波形位置的变化
        _lpFilterOldPos,       // 以前的低通波形位置
        _lpFilterPos      = 0, // 低通滤波器后调整的波形位置
        _periodTemp,           // 颤音修改后的周期
        _phase            = 0, // 波形的相位
        _phaserInt,            // 整数相位偏移，用于位运算
        _phaserPos        = 0, // 在相位缓冲区中的位置
        _pos,                  // 相位表示的数字从 0-1 ，用于快速正弦近似
        _repeatTime       = 0, // 重复计数器
        _sample,               // 每个实际样本计算的子样本，平均出超样本
        _superSample,          // 写入波形的实际样本
        _vibratoPhase     = 0; // 在颤音正弦波中经过的相位

    // 用于创建相位失真的第二波的波形值缓冲区
    var _phaserBuffer = new Array(1024),
        // 用于生成噪声的随机值缓冲区
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1; // 填充噪声缓冲区
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i; // 如果声音已结束，返回
      }

      // 每 _repeatLimit 次重复，部分重置声音参数
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset(); // 重置
        }
      }

      // 如果达到 _changeLimit，音调变化
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount; // 改变音调
        }
      }

      // 加速并应用滑音
      _slide += _deltaSlide;
      _period *= _slide;

      // 检查频率是否过低，如果设置了最小频率，则停止声音
      if (_period > _maxPeriod) {
        _period = _maxPeriod; // 防止频率过低
        if (_minFreqency > 0) {
          _finished = true; // 结束声音
        }
      }

      _periodTemp = _period;

      // 应用颤音效果
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0; // 强制转换为整数
      if (_periodTemp < 8) {
        _periodTemp = 8; // 确保不低于 8
      }

      // 滑动方波的占空比
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // 移动到音量包络的不同阶段
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0; // 重置时间

        switch (++_envelopeStage)  {
          case 1: // 持续阶段
            _envelopeLength = _envelopeLength1;
            break;
          case 2: // 衰减阶段
            _envelopeLength = _envelopeLength2;
        }
      }

      // 根据包络中的位置设置音量
      switch (_envelopeStage) {
        case 0: // 攻击阶段
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1: // 持续阶段
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2: // 衰减阶段
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3: // 结束阶段
          _envelopeVolume = 0;
          _finished = true; // 声音结束
      }

      // 移动相位偏移
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0; // 强制转换为整数
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt; // 取绝对值
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023; // 限制在范围内
        }
      }

      // 移动高通滤波器截止频率
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        // 确保在高通滤波器的有效范围内
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0; // 初始化超样本
      for (var j = 8; j--; ) {
        // 遍历周期
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp; // 循环周期

          // 生成新的随机噪声
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // 从振荡器中获取样本
        switch (_waveType) {
          case 0: // 方波
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // 锯齿波
            _sample = 1 - _phase / _periodTemp * 2;
            break;
            case 2: // 正弦波（快速且准确的近似）
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531; // 将位置映射到 -π 到 π
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1); // 计算正弦值
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample - _sample) + _sample; // 调整样本的幅度
            break;
          case 3: // 噪声
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)]; // 从噪声缓冲区获取样本
        }

        // 应用低通和高通滤波器
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos; // 保存旧的低通滤波器位置
          _lpFilterCutoff *= _lpFilterDeltaCutoff; // 更新低通滤波器截止频率
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0; // 确保不低于 0
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1; // 限制在有效范围内
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff; // 计算低通波形位置的变化
            _lpFilterDeltaPos *= _lpFilterDamping; // 应用阻尼
          } else {
            _lpFilterPos = _sample; // 如果低通滤波器关闭，直接设置为样本
            _lpFilterDeltaPos = 0; // 重置变化量
          }

          _lpFilterPos += _lpFilterDeltaPos; // 更新低通滤波器位置

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos; // 更新高通滤波器位置
          _hpFilterPos *= 1 - _hpFilterCutoff; // 应用高通滤波器截止频率
          _sample = _hpFilterPos; // 最终样本为高通滤波器输出
        }

        // 应用相位效果
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample; // 将当前样本存储到相位缓冲区
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024]; // 添加相位缓冲区中的样本
          _phaserPos++; // 增加相位位置
        }

        _superSample += _sample; // 累加超样本
      }

      // 对超样本进行平均并应用音量
      _superSample *= .125 * _envelopeVolume * _masterVolume; // 应用音量调整

      // 如果样本过大，则进行剪辑
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0; // 转换为 16 位 PCM 格式
    }

    return length; // 返回生成样本的长度
  }
}

// 从 http://codebase.es/riffwave/ 改编而来
var synth = new SfxrSynth(); // 创建合成器实例
// 导出给 Closure Compiler
window['jsfxr'] = function(settings) {
  // 初始化 SfxrParams
  synth._params.setSettings(settings); // 设置参数
  // 合成波形
  var envelopeFullLength = synth.totalReset(); // 获取完整包络长度
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44); // 创建用于 WAV 数据的缓冲区
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2; // 生成波形并写入缓冲区
  var dv = new Uint32Array(data.buffer, 0, 44); // 创建 32 位数组用于 WAV 头

  // 初始化 WAV 头
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // 在此处放置总大小
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // 后续数据的大小
  dv[5] = 0x00010001; // 单声道：1 通道，PCM 格式
  dv[6] = 0x0000AC44; // 44,100 采样率
  dv[7] = 0x00015888; // 字节率：每个样本两个字节
  dv[8] = 0x00100002; // 每个样本 16 位，按两个字节对齐
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // 在此处放置样本的数量

  // Base64 编码，作者：@maettig
  used += 44; // 计算数据的总字节数
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,'; // 初始化输出字符串
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2]; // 将三个字节组合为一个 24 位整数
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63]; // 将其转换为 Base64 字符
  }
  return output; // 返回生成的音频数据 URL
}