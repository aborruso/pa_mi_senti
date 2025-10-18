import { useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import CityList from './components/CityList';
import ContextList from './components/ContextList';
import ContextDetail from './components/ContextDetail';
import TemplatePicker from './components/TemplatePicker';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { useRegistry } from './hooks/useRegistry';
import { useRoute } from './hooks/useRoute';
import { useTemplates } from './hooks/useTemplates';
import type { ContextEntry, ContactChannel } from './types/pa';

const App = () => {
  const [registryState, reloadRegistry] = useRegistry();
  const [templateState, reloadTemplates] = useTemplates();
  const [route, navigate] = useRoute();

  const municipalities = useMemo(
    () => registryState.data?.municipalities ?? [],
    [registryState.data]
  );

  const activeMunicipality = useMemo(() => {
    if (route.name === 'home') {
      return undefined;
    }
    return municipalities.find((item) => item.istat === route.istat);
  }, [municipalities, route]);

  const activeContext: ContextEntry | undefined = useMemo(() => {
    if (!activeMunicipality) {
      return undefined;
    }
    if (route.name === 'context' || route.name === 'templates') {
      return activeMunicipality.contexts.find((context) => context.slug === route.contextSlug);
    }
    return undefined;
  }, [activeMunicipality, route]);

  const activeChannel: ContactChannel | undefined = useMemo(() => {
    if (route.name !== 'templates' || !activeContext) {
      return undefined;
    }
    return activeContext.channels.find((channel) => channel.key === route.channelKey);
  }, [route, activeContext]);

  const activeTemplateGroup = useMemo(() => {
    if (route.name !== 'templates' || !templateState.data) {
      return undefined;
    }
    return templateState.data.templates.find(
      (group) =>
        group.contextSlug === route.contextSlug && group.channelKey === route.channelKey
    );
  }, [route, templateState.data]);

  useEffect(() => {
    const baseTitle = 'PA Mi Senti';
    if (route.name === 'home') {
      document.title = `${baseTitle} · Trova il canale giusto`;
      return;
    }
    if (route.name === 'city' && activeMunicipality) {
      document.title = `${activeMunicipality.name} · ${baseTitle}`;
      return;
    }
    if (route.name === 'context' && activeMunicipality && activeContext) {
      document.title = `${activeContext.name} · ${activeMunicipality.name} · ${baseTitle}`;
      return;
    }
    if (route.name === 'templates' && activeMunicipality && activeContext && activeChannel) {
      document.title = `${activeChannel.label} · ${activeContext.name} · ${activeMunicipality.name} · ${baseTitle}`;
      return;
    }
    document.title = baseTitle;
  }, [route, activeMunicipality, activeContext, activeChannel]);

  return (
    <Layout>
      {registryState.status === 'loading' ? <LoadingState /> : null}
      {registryState.status === 'error' ? (
        <ErrorState message={registryState.error} onRetry={reloadRegistry} />
      ) : null}
      {registryState.status === 'ready' ? (
        <>
          <Breadcrumbs
            municipality={activeMunicipality}
            contextSlug={
              route.name === 'context' || route.name === 'templates'
                ? route.contextSlug
                : undefined
            }
            contextName={activeContext?.name}
            channelLabel={route.name === 'templates' ? activeChannel?.label : undefined}
            onNavigate={navigate}
          />
          {route.name === 'home' ? (
            <section className="space-y-6">
              <header>
                <h2 className="text-xl font-semibold text-slate-900">
                  Seleziona la città da contattare
                </h2>
                <p className="text-sm text-slate-600">
                  Ogni città ha canali tematici curati in `pa.yml`. Aggiungine di nuove per
                  espandere il servizio.
                </p>
              </header>
              <CityList municipalities={municipalities} onNavigate={navigate} />
            </section>
          ) : null}
          {route.name === 'city' && activeMunicipality ? (
            <ContextList municipality={activeMunicipality} onNavigate={navigate} />
          ) : null}
          {route.name === 'context' && activeMunicipality && activeContext ? (
            <ContextDetail
              municipality={activeMunicipality}
              context={activeContext}
              onNavigate={navigate}
            />
          ) : null}
          {route.name === 'templates' && activeMunicipality && activeContext ? (
            activeChannel ? (
              templateState.status === 'loading' ? (
                <LoadingState />
              ) : templateState.status === 'error' ? (
                <ErrorState message={templateState.error} onRetry={reloadTemplates} />
              ) : (
                <TemplatePicker
                  municipality={activeMunicipality}
                  context={activeContext}
                  channel={activeChannel}
                  templateGroup={activeTemplateGroup}
                  onNavigate={navigate}
                />
              )
            ) : (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                Canale non riconosciuto. Torna alla lista dei canali disponibili.
              </p>
            )
          ) : null}
          {(route.name === 'context' || route.name === 'templates') && !activeContext ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Tema non trovato. Torna all&apos;elenco dei temi disponibili per questa città.
            </p>
          ) : null}
        </>
      ) : null}
    </Layout>
  );
};

export default App;
