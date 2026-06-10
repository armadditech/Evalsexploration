'use client';

import { useContextStore } from '@/lib/contextStore';
import { DOMAIN_EXAMPLES, SYSTEM_TYPE_INFO } from '@/lib/userContext';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

export default function ContextBanner() {
  const { context, hasCompletedOnboarding } = useContextStore();

  if (!hasCompletedOnboarding || !context.aiSystemType) {
    return null;
  }

  const domainInfo = DOMAIN_EXAMPLES[context.domain];
  const typeInfo = SYSTEM_TYPE_INFO[context.aiSystemType];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FaCheckCircle className="text-green-300" size={20} />
        <div>
          <div className="font-semibold text-sm">
            Personalized for: {context.systemDescription || `${context.aiSystemType} system`}
          </div>
          <div className="text-xs text-white/80 flex items-center gap-3 mt-0.5">
            <span>{domainInfo?.icon} {context.domain}</span>
            <span>•</span>
            <span>Recommended: {typeInfo.recommendedScorers[0]}</span>
            {context.experienceLevel && (
              <>
                <span>•</span>
                <span>Level: {context.experienceLevel}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/90">
        <FaInfoCircle />
        <span>Content adapted to your use case</span>
      </div>
    </div>
  );
}
