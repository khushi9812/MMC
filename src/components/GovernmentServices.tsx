import React from 'react';
import { MysuruAuthorityInfo } from '../types/mysuru';
import {
  Building2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface GovernmentServicesProps {
  authorities: MysuruAuthorityInfo[];
  lang?: 'en' | 'kn';
}

export const GovernmentServices: React.FC<GovernmentServicesProps> = ({
  authorities,
  lang = 'en',
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Karnataka & Mysuru Statutory Planning Authorities
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verified institutional directory of departments handling building sanctions, layout approvals, Khata transfers, and revenue records in Mysuru.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {authorities.map((auth) => (
            <div
              key={auth.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col justify-between text-xs space-y-3"
            >
              <div>
                {/* Authority Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 text-blue-800 uppercase">
                      {auth.acronym}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1.5 leading-snug">
                      {auth.name}
                    </h3>
                  </div>

                  <a
                    href={auth.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 border border-blue-200 shrink-0"
                    title="Open official portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-slate-500 text-[11px] mt-1 font-medium">
                  Jurisdiction: <span className="text-slate-700">{auth.jurisdiction}</span>
                </p>

                {/* Services */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Services Handled:
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {auth.servicesHandled.map((srv, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statutory Guidelines */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                  <strong>Statutory Scope:</strong> {auth.relevantGuidelines}
                </div>
              </div>

              {/* Contact Footer */}
              <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{auth.officeAddress}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{auth.helplinePhone}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>Last Verified: {auth.lastVerifiedDate}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified Official
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
