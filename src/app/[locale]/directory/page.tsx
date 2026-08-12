import { Metadata } from "next";

import { getAllAgents, type AgentRecord } from "@/lib/data/agents";
import { getCustomerAuth } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "Real Estate Agent Directory",
  description: "Find verified real estate agents in our directory",
};

export default async function DirectoryPage() {
  const session = await getCustomerAuth();
  const userPreferredLanguage = session?.preferredLanguage || "en";

  const agents = await getAllAgents();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Find Your Perfect Real Estate Agent
        </h2>
        
        <div className="space-y-6">
          {agents.map(agent => (
            <AgentCard key={agent.agentId} agent={agent} userPreferredLanguage={userPreferredLanguage} />
          ))}
          
          {agents.length === 0 && (
            <p className="text-center text-muted-foreground">
              No agents found. Be the first to join our directory!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function AgentCard({ agent, userPreferredLanguage }: { agent: AgentRecord; userPreferredLanguage: string }) {
  const languageMatch = agent.defaultLanguage === userPreferredLanguage;
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 h-12 w-12 bg-muted rounded">
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            {agent.businessName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-medium">{agent.businessName}</h3>
          <p className="text-sm text-muted-foreground">
            {agent.tierLevel === "Pro_Plus" && "Pro Plus"} {agent.tierLevel === "Pro" && "Pro"} {agent.tierLevel === "Free" && "Free"} Agent
          </p>
          {!languageMatch && (
            <p className="text-xs text-muted-foreground mt-1">
              Note: Agent&apos;s default language is {agent.defaultLanguage.toUpperCase()}. Your interface is in {userPreferredLanguage.toUpperCase()}.
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="flex items-center space-x-2 text-sm">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L3 21V5z" />
          </svg>
          <span>{agent.primaryContactChannel}: {agent.primaryContactValue}</span>
        </p>
      </div>
      
      <div className="mt-4">
        <a href={`/directory/${agent.agentId}`} className="btn btn-primary">
          View Profile
        </a>
      </div>
    </div>
  );
}
