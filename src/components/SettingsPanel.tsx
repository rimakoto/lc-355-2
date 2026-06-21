import { useState } from 'react';
import { X, Bell, BellOff, Clock, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import {
  requestNotificationPermission,
  isNotificationSupported,
  getNotificationPermission,
} from '@/utils/notification';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { pushEnabled, pushTime, setPushEnabled, setPushTime, pendingReminders } =
    useNotificationStore();
  const [permissionStatus, setPermissionStatus] = useState(getNotificationPermission());
  const [testingNotification, setTestingNotification] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);

  if (!isOpen) return null;

  const handleEnablePush = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        setPushEnabled(true);
      } else {
        setPushEnabled(false);
        return;
      }
    } else {
      setPushEnabled(false);
    }
  };

  const handleTestNotification = async () => {
    setTestingNotification(true);
    setTestResult(null);
    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);
    setTimeout(() => {
      setTestingNotification(false);
      setTestResult(permission === 'granted' ? 'success' : 'fail');
      setTimeout(() => setTestResult(null), 2000);
    }, 1000);
  };

  const openWidgetMode = () => {
    window.open('/widget', '_blank', 'width=375,height=560');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">设置</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Bell size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">定时推送通知</h4>
                <p className="text-sm text-gray-500">每天定时收到今日名言</p>
              </div>
            </div>

            {!isNotificationSupported() && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>您的浏览器不支持通知功能，请使用 Chrome、Edge 或 Safari 等现代浏览器。</span>
              </div>
            )}

            {isNotificationSupported() && permissionStatus === 'denied' && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  通知权限已被拒绝。请在浏览器设置中手动允许本网站的通知权限。
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-700">启用推送</span>
              <button
                onClick={() => handleEnablePush(!pushEnabled)}
                disabled={!isNotificationSupported() || permissionStatus === 'denied'}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  pushEnabled ? 'bg-blue-500' : 'bg-gray-300'
                } ${
                  !isNotificationSupported() || permissionStatus === 'denied'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    pushEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {pushEnabled && (
              <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-4">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-500" />
                  <label className="text-gray-700 text-sm">推送时间</label>
                </div>
                <input
                  type="time"
                  value={pushTime}
                  onChange={(e) => setPushTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                />
                <p className="text-xs text-gray-500">
                  每天 {pushTime} 将推送今日名言（需保持至少一个标签页打开）
                </p>

                <button
                  onClick={handleTestNotification}
                  disabled={testingNotification}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                >
                  {testingNotification ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>正在发送测试通知...</span>
                    </>
                  ) : testResult === 'success' ? (
                    <>
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span className="text-green-600">测试通知已发送</span>
                    </>
                  ) : testResult === 'fail' ? (
                    <>
                      <BellOff size={18} className="text-red-500" />
                      <span className="text-red-600">通知发送失败，请检查权限</span>
                    </>
                  ) : (
                    <>
                      <Bell size={18} />
                      <span>发送测试通知</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {pendingReminders.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 font-medium">
                  有 {pendingReminders.length} 条"稍后再看"提醒待发送
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  到时间后会自动弹出通知
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <Smartphone size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">桌面小组件</h4>
                <p className="text-sm text-gray-500">打开极简模式窗口</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 pl-13">
              将每日名言以小组件形式放在桌面角落，窗口大小固定，只显示卡片内容。
            </p>

            <button
              onClick={openWidgetMode}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
            >
              <Smartphone size={18} />
              <span>打开小组件模式</span>
            </button>

            <p className="text-xs text-gray-400">
              提示：也可以直接访问 /widget 路径
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
