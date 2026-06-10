import { FaGraduationCap, FaCode, FaBook, FaFileAlt, FaCog } from 'react-icons/fa';
import { useContextStore } from '@/lib/contextStore';
import { DOMAIN_EXAMPLES } from '@/lib/userContext';

type View = 'tutorial' | 'playground' | 'examples' | 'docs';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { context, hasCompletedOnboarding, resetContext } = useContextStore();
  const menuItems = [
    { id: 'tutorial' as View, icon: FaGraduationCap, label: 'Tutorial', color: 'blue' },
    { id: 'playground' as View, icon: FaCode, label: 'Playground', color: 'green' },
    { id: 'examples' as View, icon: FaFileAlt, label: 'Examples', color: 'purple' },
    { id: 'docs' as View, icon: FaBook, label: 'Docs', color: 'orange' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎓 AI Evals
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Learn to Build Evaluations
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? `bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400`
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`text-xl ${isActive ? `text-${item.color}-600` : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {hasCompletedOnboarding && context.aiSystemType ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Your Setup
              </p>
              <button
                onClick={() => {
                  if (confirm('Reset your setup? This will restart the onboarding.')) {
                    resetContext();
                    window.location.reload();
                  }
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaCog size={12} />
              </button>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Type:</span> {context.aiSystemType}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Domain:</span> {DOMAIN_EXAMPLES[context.domain]?.icon} {context.domain}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              💡 Quick Tip
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Complete the onboarding to get personalized content for your AI system!
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
