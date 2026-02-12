import { useState, useEffect } from 'react'
import './App.css'
import { SplashScreen } from '@capacitor/splash-screen'

function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [answers, setAnswers] = useState('')
  const [loading, setLoading] = useState(false)
  const [testConfig, setTestConfig] = useState('Fizika (1-12), Kimyo (13-24), Biologiya (25-36)')

  useEffect(() => {
    // Hide splash screen when app is ready
    SplashScreen.hide()
  }, [])

  const SYSTEM_PROMPT = `Siz professional test tahlilchisisiz. Juda ehtiyotkorlik bilan ishlang.

TEST FORMATI:
${testConfig}

Har savolda 4 variant: A, B, C, D
- TO'LDIRILGAN doira: TO'Q KO'K/BINAFSHA/QO'NG'IR (90-100% to'lgan)
- BO'SH doira: OCH rang yoki OQ (5-15% to'lgan)

TAHLIL QOIDALARI:
1. Har bir savolni alohida ko'ring
2. 4 ta doirani SOLISHTIRING - eng to'q rangli = javob
3. Agar HAMMA doiralar bir xil och bo'lsa = BO'SH (yozmaslik)
4. Shubhali = BO'SH

NATIJA (faqat to'ldirilgan javoblar):
1.C
2.C
3.B

Bo'sh savollarni yozmaslik!`

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1600
          const MAX_HEIGHT = 2000
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          // Increase contrast
          ctx.filter = 'contrast(1.3) brightness(1.1)'
          ctx.drawImage(img, 0, 0, width, height)
          
          const compressed = canvas.toDataURL('image/jpeg', 0.95)
          setPreview(compressed)
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeTest = async () => {
    if (!image || !preview) return
    
    setLoading(true)
    
    try {
      const response = await window.puter.ai.chat(
        SYSTEM_PROMPT,
        preview,
        { model: 'gemini-3-pro-preview' }
      )
      setAnswers(response.message.content || 'No content')
    } catch (error) {
      console.error('Full error:', error)
      setAnswers('Xatolik yuz berdi: ' + (error.message || JSON.stringify(error)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>AI DTM Test Tahlilchisi</h1>
      
      <div className="config-section">
        <label htmlFor="test-config">Test formati:</label>
        <input 
          type="text" 
          id="test-config"
          value={testConfig}
          onChange={(e) => setTestConfig(e.target.value)}
          placeholder="Masalan: Matematika (1-20), Informatika (21-40)"
          className="config-input"
        />
        <small>Misol: Fizika (1-12), Kimyo (13-24), Biologiya (25-36)</small>
      </div>
      
      <div className="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-btn">
          Rasm yuklash
        </label>
      </div>

      {preview && (
        <div className="preview-section">
          <img src={preview} alt="Test" className="preview-image" />
          <button onClick={analyzeTest} disabled={loading} className="analyze-btn">
            {loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
          </button>
        </div>
      )}

      {answers && (
        <div className="results-section">
          <h2>Javoblar:</h2>
          <pre className="answers">{String(answers)}</pre>
          <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>Length: {answers.length}</div>
        </div>
      )}
    </div>
  )
}

export default App
