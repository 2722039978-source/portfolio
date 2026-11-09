import { useState, type CSSProperties } from 'react'
import { RotateCcw, ArrowUpRight } from 'lucide-react'

const colors = [{ name: '紫色', value: '#6543d3' }, { name: '橙色', value: '#ae4524' }, { name: '蓝色', value: '#3456d1' }]

export default function TypePlayground() {
  const [text, setText] = useState('What if?')
  const [spacing, setSpacing] = useState(-4)
  const [weight, setWeight] = useState('700')
  const [color, setColor] = useState(colors[0].value)
  const [inverted, setInverted] = useState(false)
  function reset() { setText('What if?'); setSpacing(-4); setWeight('700'); setColor(colors[0].value); setInverted(false) }
  return <div className="type-playground" style={{ '--play-color': color } as CSSProperties}>
    <div className={`type-stage ${inverted ? 'inverted' : ''}`}>
      <span className="mono">TYPE STUDY / 001</span>
      <div className="type-output" aria-live="polite" style={{ letterSpacing: `${spacing}px`, fontWeight: weight }}>{text || 'What if?'}</div>
      <span className="mono">字母之间，也有无限可能。</span>
      <ArrowUpRight className="type-corner" size={30} aria-hidden="true" />
    </div>
    <div className="type-controls">
      <label>输入文字<input value={text} onChange={event => setText(event.target.value)} maxLength={18} aria-label="实验文字" /></label>
      <label>字距 <output>{spacing}px</output><input type="range" min="-5" max="8" value={spacing} onChange={event => setSpacing(Number(event.target.value))} aria-label="字距" /></label>
      <label>字重<select aria-label="字重" value={weight} onChange={event => setWeight(event.target.value)}><option value="400">Regular</option><option value="500">Medium</option><option value="700">Bold</option></select></label>
      <fieldset className="color-options"><legend>文字颜色</legend>{colors.map(item => <button key={item.value} aria-label={item.name} aria-pressed={color === item.value} style={{ background: item.value }} onClick={() => setColor(item.value)} />)}</fieldset>
      <div className="play-actions"><button className="text-link" aria-pressed={inverted} onClick={() => setInverted(!inverted)}>反转颜色</button><button className="icon-button" onClick={reset} aria-label="重置实验"><RotateCcw size={18} /></button></div>
    </div>
  </div>
}
