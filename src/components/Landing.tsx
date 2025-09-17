import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, CheckCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop"
          alt="Ayurvedic herbs"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-emerald-100 text-sm">Classical Ayurveda</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Panchakarma – Cleansing and Rejuvenation</h1>
          <p className="mt-4 text-emerald-100 max-w-3xl">
            Panchakarma (five actions) is a personalized Ayurvedic program that cleanses the body, mind, and consciousness while restoring doshic balance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/schedule" className="inline-flex items-center rounded-lg bg-white text-emerald-700 px-5 py-3 font-semibold shadow hover:bg-emerald-50">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a href="https://ayurveda.com/introduction-to-panchakarma/" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10">
              Learn the Tradition
            </a>
          </div>
        </div>
      </section>

      {/* What is Panchakarma */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What is Panchakarma?</h2>
        <p className="text-gray-700">
          Panchakarma is an individualized therapeutic cleanse and rejuvenation program rooted in the Ayurvedic understanding of the five elements and the three doshas—Vata, Pitta, and Kapha. Disturbance of this balance leads to disorder; Panchakarma restores order through staged preparation and targeted cleansing.
          Source: <a className="text-emerald-700 underline" href="https://ayurveda.com/introduction-to-panchakarma/" target="_blank" rel="noreferrer">ayurveda.com</a>.
        </p>
      </section>

      {/* Tridosha Overview */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ayurvedic Tridosha</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Vata', desc: 'Movement, nervous system, elimination. In balance: creativity and flexibility; out of balance: anxiety, insomnia, constipation.' },
            { name: 'Pitta', desc: 'Transformation, metabolism, digestion. In balance: sharp intellect and lustre; out of balance: heat, rashes, irritability.' },
            { name: 'Kapha', desc: 'Structure, stability, immunity. In balance: stamina and calm; out of balance: heaviness, lethargy, congestion.' },
          ].map((d, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{d.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Purvakarma */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Purvakarma – Pre‑purification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img className="h-40 w-full object-cover" src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop" alt="Oil massage" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">Snehan (Oleation)</h4>
              <p className="text-sm text-gray-600 mt-1">Therapeutic oiling and massage to mobilize toxins toward the GI tract and nourish the nervous system.</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img className="h-40 w-full object-cover" src="https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop" alt="Herbal steam" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">Svedana (Sudation)</h4>
              <p className="text-sm text-gray-600 mt-1">Herbal steam/sweating that liquefies and moves toxins into the GI tract, preparing for cleansing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Shodanas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Five Shodanas – Cleansing Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { name: 'Vamana', text: 'Therapeutic emesis to eliminate aggravated Kapha and respiratory congestion.' },
            { name: 'Virechana', text: 'Therapeutic purgation to reduce excess Pitta and clear bile-related disorders.' },
            { name: 'Basti', text: 'Medicated enema to modulate Vata and address deep-seated imbalances.' },
            { name: 'Nasya', text: 'Nasal administration supporting prana, cognition, and sinus health.' },
            { name: 'Rakta Moksha', text: 'Traditional blood purification techniques for certain inflammatory conditions.' },
          ].map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{s.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Reference: <a href="https://ayurveda.com/introduction-to-panchakarma/" className="text-emerald-700 underline" target="_blank" rel="noreferrer">Introduction to Panchakarma</a>.</p>
      </section>

      {/* Benefits */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits of Panchakarma</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Eliminates toxins and clears channels',
            'Restores constitutional balance (Vata, Pitta, Kapha)',
            'Strengthens immunity and resilience',
            'Reverses stress effects and supports healthy aging',
            'Promotes deep relaxation and mental clarity',
          ].map((b, i) => (
            <div key={i} className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <p className="text-sm text-gray-700">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle during therapy */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lifestyle & Diet During Therapy</h3>
        <p className="text-sm text-gray-700 mb-3">Amid cleansing, rest and simplicity are emphasized. Common guidelines include:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 list-disc list-inside">
          <li>Plenty of rest; avoid strenuous activity and late nights</li>
          <li>Keep warm; minimize exposure to wind and cold</li>
          <li>Simple kitchari-based diet; avoid cold foods and stimulants</li>
          <li>Limit media overstimulation; observe thoughts and emotions</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">Adapted from <a href="https://ayurveda.com/introduction-to-panchakarma/" className="text-emerald-700 underline" target="_blank" rel="noreferrer">ayurveda.com</a>.</p>
      </section>
    </div>
  );
}


