import { useSettingsStore } from '@/stores/settingsStore';

export function Settings({ onClose }: { onClose: () => void }) {
  const { crtFilter, soundEnabled, metricsEnabled, toggleCrt, toggleSound, toggleMetrics } =
    useSettingsStore();

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="settings-title">SETTINGS</h2>

        <label className="settings-row">
          <span>CRT Scanline Filter</span>
          <button className={`toggle ${crtFilter ? 'on' : 'off'}`} onClick={toggleCrt}>
            {crtFilter ? 'ON' : 'OFF'}
          </button>
        </label>

        <label className="settings-row">
          <span>Sound Effects</span>
          <button className={`toggle ${soundEnabled ? 'on' : 'off'}`} onClick={toggleSound}>
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </label>

        <label className="settings-row">
          <span>Grafana Metrics</span>
          <button className={`toggle ${metricsEnabled ? 'on' : 'off'}`} onClick={toggleMetrics}>
            {metricsEnabled ? 'ON' : 'OFF'}
          </button>
        </label>

        <button className="menu-btn menu-btn-secondary settings-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
