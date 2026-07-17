export default function NotificationsSettingsPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">Notification Preferences</h2>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 shadow-sm">
          <div>
            <h3 className="font-medium text-foreground">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive a daily summary of missed activity.</p>
          </div>
          <input type="checkbox" defaultChecked className="size-5 accent-brand-blue" />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 shadow-sm">
          <div>
            <h3 className="font-medium text-foreground">Check-in Alerts</h3>
            <p className="text-sm text-muted-foreground">Get notified when someone from your network checks in nearby.</p>
          </div>
          <input type="checkbox" defaultChecked className="size-5 accent-brand-blue" />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 shadow-sm">
          <div>
            <h3 className="font-medium text-foreground">Direct Messages</h3>
            <p className="text-sm text-muted-foreground">Receive push notifications for new direct messages.</p>
          </div>
          <input type="checkbox" defaultChecked className="size-5 accent-brand-blue" />
        </div>
        
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 shadow-sm">
          <div>
            <h3 className="font-medium text-foreground">Marketing & Updates</h3>
            <p className="text-sm text-muted-foreground">Receive product updates and promotional offers.</p>
          </div>
          <input type="checkbox" className="size-5 accent-brand-blue" />
        </div>
      </div>
    </div>
  )
}
