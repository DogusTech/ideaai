import React, { useState, useEffect } from "react"
import { X, Users, Mail, CheckCircle2, Copy, Trash2, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, onSnapshot, serverTimestamp } from "firebase/firestore"

type TeamModalProps = {
  isOpen: boolean
  onClose: () => void
  userEmail: string | null
}

export function TeamModal({ isOpen, onClose, userEmail }: TeamModalProps) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [invites, setInvites] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  // Fetch pending invites for the current workspace (assuming workspace is userEmail for now)
  useEffect(() => {
    if (!isOpen || !userEmail) return

    const q = query(collection(db, "invitations"), where("workspaceId", "==", userEmail))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedInvites = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setInvites(fetchedInvites)
    })

    return () => unsubscribe()
  }, [isOpen, userEmail])

  if (!isOpen) return null

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !userEmail) return

    setIsInviting(true)
    try {
      await addDoc(collection(db, "invitations"), {
        email: inviteEmail,
        workspaceId: userEmail,
        status: "pending",
        role: "member",
        createdAt: serverTimestamp()
      })
      setInviteEmail("")
    } catch (error) {
      console.error("Error sending invite:", error)
    } finally {
      setIsInviting(false)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://togetlink.com/invite?workspace=${userEmail}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-[500px] bg-white rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-[#e5e5e5]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between bg-[#fafafa]">
          <div className="flex items-center gap-2 text-[#171717] font-semibold text-[15px]">
            <Users className="w-5 h-5" />
            Manage Workspace Team
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-[#737373] hover:bg-[#e5e5e5] hover:text-[#171717] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          
          <div className="mb-6">
            <h3 className="text-[14px] font-semibold text-[#171717] mb-2">Invite new members</h3>
            <p className="text-[13px] text-[#737373] mb-4">
              Send an email invitation. They will be required to create an account and accept the invite to access this workspace.
            </p>
            
            <form onSubmit={handleInvite} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#a3a3a3]" />
                </div>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#f4f4f4] border border-[#e5e5e5] rounded-md text-[14px] text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isInviting || !inviteEmail}
                className="px-4 py-2 bg-[#171717] text-white text-[13px] font-medium rounded-md hover:bg-[#262626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isInviting ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#171717]">Pending Invitations</h3>
              <button onClick={copyInviteLink} className="text-[12px] font-medium text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 transition-colors">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied Link" : "Copy Invite Link"}
              </button>
            </div>
            
            {invites.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-[#d4d4d4] flex flex-col items-center justify-center text-[#a3a3a3] text-[13px]">
                <ShieldAlert className="w-6 h-6 mb-2 opacity-50" />
                No pending invitations
              </div>
            ) : (
              <div className="space-y-2">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 bg-[#fafafa] border border-[#e5e5e5] rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[#171717]">{invite.email}</span>
                      <span className="text-[11px] text-[#a3a3a3]">Invited as {invite.role}</span>
                    </div>
                    <button className="p-1.5 text-[#a3a3a3] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Workspace Members</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#818cf8] flex items-center justify-center text-white text-[12px] font-medium shadow-inner">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-[#171717]">{userEmail} (You)</span>
                    <span className="text-[11px] text-[#737373]">Workspace Owner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  )
}
