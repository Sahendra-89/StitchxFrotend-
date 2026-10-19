import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export function Hero() {
  const [activeCodeTab, setActiveCodeTab] = useState('architecture');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    architecture: [
      { num: "01", tokens: [{ type: "comment", text: "// Enterprise Cloud Cluster Architecture" }] },
      { num: "02", tokens: [{ type: "keyword", text: "import" }, { type: "text", text: " { StitchXCloud, HighAvailability } " }, { type: "keyword", text: "from" }, { type: "string", text: " '@stitchx/core'" }, { type: "text", text: ";" }] },
      { num: "03", tokens: [{ type: "text", text: "" }] },
      { num: "04", tokens: [{ type: "keyword", text: "export const" }, { type: "func", text: " enterpriseCluster" }, { type: "text", text: " = " }, { type: "keyword", text: "new" }, { type: "func", text: " StitchXCloud" }, { type: "text", text: "({" }] },
      { num: "05", tokens: [{ type: "prop", text: "  regions" }, { type: "text", text: ": [" }, { type: "string", text: "'ap-south-1 (Mumbai)'" }, { type: "text", text: ", " }, { type: "string", text: "'us-east-1 (Virginia)'" }, { type: "text", text: "]," }] },
      { num: "06", tokens: [{ type: "prop", text: "  autoScaling" }, { type: "text", text: ": { " }, { type: "prop", text: "minNodes" }, { type: "text", text: ": " }, { type: "num", text: "4" }, { type: "text", text: ", " }, { type: "prop", text: "maxNodes" }, { type: "text", text: ": " }, { type: "num", text: "64" }, { type: "text", text: " }," }] },
      { num: "07", tokens: [{ type: "prop", text: "  latencySLAGuarantee" }, { type: "text", text: ": " }, { type: "string", text: "'< 35ms p99'" }, { type: "text", text: "," }] },
      { num: "08", tokens: [{ type: "prop", text: "  encryption" }, { type: "text", text: ": " }, { type: "string", text: "'AES-256-GCM + Hardware TLS'" }] },
      { num: "09", tokens: [{ type: "text", text: "});" }] },
      { num: "10", tokens: [{ type: "text", text: "" }] },
      { num: "11", tokens: [{ type: "comment", text: "// Automated Zero-Downtime Deployment" }] },
      { num: "12", tokens: [{ type: "keyword", text: "await" }, { type: "text", text: " enterpriseCluster." }, { type: "func", text: "deployProduction" }, { type: "text", text: "({ " }, { type: "prop", text: "zeroDowntime" }, { type: "text", text: ": " }, { type: "keyword", text: "true" }, { type: "text", text: " });" }] }
    ],
    security: [
      { num: "01", tokens: [{ type: "comment", text: "// OWASP & Enterprise RBAC Compliance Engine" }] },
      { num: "02", tokens: [{ type: "keyword", text: "import" }, { type: "text", text: " { AuthEngine, VaultCipher, AuditLog } " }, { type: "keyword", text: "from" }, { type: "string", text: " '@stitchx/security'" }, { type: "text", text: ";" }] },
      { num: "03", tokens: [{ type: "text", text: "" }] },
      { num: "04", tokens: [{ type: "keyword", text: "export const" }, { type: "func", text: " securityPolicy" }, { type: "text", text: " = " }, { type: "func", text: "defineGuard" }, { type: "text", text: "({" }] },
      { num: "05", tokens: [{ type: "prop", text: "  authWorkflow" }, { type: "text", text: ": " }, { type: "string", text: "'Multi-Factor OAuth2 + Ed25519 JWT'" }, { type: "text", text: "," }] },
      { num: "06", tokens: [{ type: "prop", text: "  rateLimiter" }, { type: "text", text: ": " }, { type: "string", text: "'Distributed Redis Token Bucket'" }, { type: "text", text: "," }] },
      { num: "07", tokens: [{ type: "prop", text: "  ddosProtection" }, { type: "text", text: ": " }, { type: "string", text: "'Edge WAF & Bot Mitigation'" }, { type: "text", text: "," }] },
      { num: "08", tokens: [{ type: "prop", text: "  certifications" }, { type: "text", text: ": [" }, { type: "string", text: "'SOC2 Type II'" }, { type: "text", text: ", " }, { type: "string", text: "'ISO 27001'" }, { type: "text", text: ", " }, { type: "string", text: "'GDPR'" }, { type: "text", text: "]" }] },
      { num: "09", tokens: [{ type: "text", text: "});" }] }
    ],
    performance: [
      { num: "01", tokens: [{ type: "comment", text: "// Sub-Millisecond Global Caching Layer" }] },
      { num: "02", tokens: [{ type: "keyword", text: "import" }, { type: "text", text: " { EdgeWorker, PostgresPool, RedisCache } " }, { type: "keyword", text: "from" }, { type: "string", text: " '@stitchx/edge'" }, { type: "text", text: ";" }] },
      { num: "03", tokens: [{ type: "text", text: "" }] },
      { num: "04", tokens: [{ type: "keyword", text: "export async function" }, { type: "func", text: " executeHighThroughput" }, { type: "text", text: "(req) {" }] },
      { num: "05", tokens: [{ type: "keyword", text: "  const" }, { type: "text", text: " cached = " }, { type: "keyword", text: "await" }, { type: "text", text: " RedisCache." }, { type: "func", text: "get" }, { type: "text", text: "(req.key);" }] },
      { num: "06", tokens: [{ type: "keyword", text: "  if" }, { type: "text", text: " (cached) " }, { type: "keyword", text: "return" }, { type: "text", text: " { data: cached, " }, { type: "prop", text: "source" }, { type: "text", text: ": " }, { type: "string", text: "'L1-Edge-CDN'" }, { type: "text", text: " };" }] },
      { num: "07", tokens: [{ type: "keyword", text: "  return await" }, { type: "text", text: " PostgresPool." }, { type: "func", text: "queryReadOnlyReplica" }, { type: "text", text: "(req.query);" }] },
      { num: "08", tokens: [{ type: "text", text: "}" }] }
    ]
  };

  return (
    <section 
      id="home" 
      className="relative overflow-hidden text-white pt-10 md:pt-14 lg:pt-16 pb-12 md:pb-16 lg:pb-20 border-b border-[#1448B0]/40"
      style={{
        background: 'linear-gradient(90deg, #071A8C 0%, #0F389F 25%, #1C54B1 50%, #2776C7 75%, #369FE2 100%)'
      }}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-sky-300/15 rounded-full blur-3xl transform translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Main Grid: Value Proposition + Hero Illustration */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
            {/* Tagline */}
            <div className="text-xs sm:text-sm font-extrabold tracking-[0.22em] text-white/95 uppercase">
              INNOVATE. DEVELOP. SCALE.
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-[1.18] drop-shadow-xs">
              We Architect and Build Resilient Software for Ambitious Enterprises
            </h1>

            <p className="text-base sm:text-lg text-blue-50/90 leading-relaxed max-w-xl font-normal">
              From enterprise web platforms and high-concurrency mobile products to custom CRM engines and business automation, we translate complex functional requirements into dependable, production-ready software.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link 
                to="/contact" 
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold bg-white text-[#0B2995] hover:bg-blue-50 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Schedule Technical Discovery</span>
                <ArrowRight className="h-4 w-4 text-[#0B2995] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link 
                to="/portfolio" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200 backdrop-blur-xs"
              >
                <span>View Production Work</span>
              </Link>
            </div>

            {/* Credibility Anchors */}
            <div className="pt-5 sm:pt-6 grid grid-cols-3 gap-2.5 sm:gap-6 border-t border-white/20 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white">100%</p>
                <p className="text-[11px] sm:text-xs text-blue-100 font-medium mt-0.5 leading-snug">Code Ownership Transfer</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white">Strict</p>
                <p className="text-[11px] sm:text-xs text-blue-100 font-medium mt-0.5 leading-snug">Production SLAs</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white">Zero</p>
                <p className="text-[11px] sm:text-xs text-blue-100 font-medium mt-0.5 leading-snug">Vendor Lock-In</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Craft Interactive Coding CTA Section */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xl rounded-2xl bg-[#071124]/95 border border-white/20 shadow-[0_25px_60px_rgba(2,10,35,0.6)] backdrop-blur-xl overflow-hidden text-left relative z-10 transition-all duration-300 hover:border-white/30">
              
              {/* Code Editor Window Header */}
              <div className="px-3 sm:px-4 py-3 bg-[#0B1A38] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#EF4444]/90"></div>
                  <div className="h-3 w-3 rounded-full bg-[#F59E0B]/90"></div>
                  <div className="h-3 w-3 rounded-full bg-[#10B981]/90"></div>
                  <span className="text-xs font-mono text-blue-200/80 ml-2 font-medium hidden sm:inline">
                    stitchx-cloud-engine
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('architecture')}
                    className={`px-2 sm:px-2.5 py-1 rounded transition-colors text-[10px] sm:text-[11px] ${
                      activeCodeTab === 'architecture'
                        ? 'bg-[#1677FF] text-white font-bold'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Cluster.ts
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('security')}
                    className={`px-2 sm:px-2.5 py-1 rounded transition-colors text-[10px] sm:text-[11px] ${
                      activeCodeTab === 'security'
                        ? 'bg-[#1677FF] text-white font-bold'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Security.ts
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('performance')}
                    className={`px-2 sm:px-2.5 py-1 rounded transition-colors text-[10px] sm:text-[11px] ${
                      activeCodeTab === 'performance'
                        ? 'bg-[#1677FF] text-white font-bold'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Scale.ts
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-blue-200 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                  title="Copy Blueprint Spec"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Code Body */}
              <div className="p-3 sm:p-5 font-mono text-xs overflow-x-auto leading-relaxed max-h-[290px] select-text">
                {codeSnippets[activeCodeTab].map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-white/30 select-none text-[11px] w-5 text-right shrink-0">
                      {line.num}
                    </span>
                    <div className="flex-1 whitespace-pre">
                      {line.tokens.map((token, tIdx) => {
                        let colorClass = "text-[#E2E8F0]";
                        if (token.type === "comment") colorClass = "text-[#7A92B8] italic";
                        if (token.type === "keyword") colorClass = "text-[#F43F5E] font-medium";
                        if (token.type === "func") colorClass = "text-[#60A5FA] font-bold";
                        if (token.type === "string") colorClass = "text-[#34D399]";
                        if (token.type === "prop") colorClass = "text-[#FBBF24]";
                        if (token.type === "num") colorClass = "text-[#C084FC]";
                        return (
                          <span key={tIdx} className={colorClass}>
                            {token.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Status Bar */}
              <div className="px-3 sm:px-4 py-2 bg-[#050C1B] border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>142/142 Tests Passing</span>
                </div>
                <div className="text-blue-200/80 hidden xs:inline">p99 Latency: 22ms</div>
                <div className="text-white font-semibold">AES-256 Verified</div>
              </div>

              {/* Integrated Coding CTA Action Bar */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#0C2050] to-[#123382] border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Need Custom Enterprise Code Engineered?</span>
                  </div>
                  <p className="text-[11px] text-blue-200 mt-0.5">Direct senior architect access • 100% repository IP handover</p>
                </div>
                <Link
                  to="/contact"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#0B2995] hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>Build This System</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#0B2995]" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
