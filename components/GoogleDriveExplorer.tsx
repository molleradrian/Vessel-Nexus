import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  Folder, 
  File, 
  FileText, 
  FileImage, 
  Video, 
  Trash2, 
  Upload, 
  Plus, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  LogOut, 
  FolderPlus, 
  AlertTriangle, 
  Grid, 
  List, 
  Info,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Provider with Drive Scopes requested by user
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  iconLink?: string;
}

export const GoogleDriveExplorer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Create folder folder state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolderLoading, setCreatingFolderLoading] = useState(false);

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal confirm delete state
  const [deleteTarget, setDeleteTarget] = useState<DriveFile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Selected file details drawer
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  // Status message
  const [errMessage, setErrMessage] = useState<string | null>(null);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Firebase token is cached on sign in. On reload/auto-sign-in we might need 
        // to re-auth or retrieve it. For custom scopes, we re-verify or handle token expiration.
      } else {
        setUser(null);
        setToken(null);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setErrMessage(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setToken(credential.accessToken);
        setUser(result.user);
        fetchFiles(credential.accessToken);
      } else {
        throw new Error("Could not extract access token from Google sign in");
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrMessage(err.message || 'Login sequence failed. Verify your details and network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setFiles([]);
      setToken(null);
      setUser(null);
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (accessToken = token) => {
    if (!accessToken) return;
    setLoading(true);
    setErrMessage(null);
    try {
      // Fetch up to 100 non-trashed files
      const q = encodeURIComponent("trashed = false");
      const url = `https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)&q=${q}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear token to prompt re-login
          setToken(null);
          throw new Error("Access token expired. Please connect again.");
        }
        const errBody = await response.json();
        throw new Error(errBody.error?.message || 'Failed fetching files from Google Drive');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrMessage(err.message || 'Error occurred while loading files.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger file list when connected
  useEffect(() => {
    if (token) {
      fetchFiles(token);
    }
  }, [token]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFolderName.trim()) return;
    setCreatingFolderLoading(true);
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          mimeType: 'application/vnd.google-apps.folder',
        }),
      });

      if (!response.ok) {
        throw new Error('Could not create folder');
      }

      setNewFolderName('');
      setIsCreatingFolder(false);
      fetchFiles(token);
    } catch (err: any) {
      setErrMessage(err.message || 'Failed to create folder');
    } finally {
      setCreatingFolderLoading(false);
    }
  };

  const handleDeleteFile = async (file: DriveFile) => {
    if (!token) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Deletion failed. Verify permissions or file ownership');
      }

      setDeleteTarget(null);
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      fetchFiles(token);
    } catch (err: any) {
      setErrMessage(err.message || 'Failed to delete file.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Drag & Drop uploading
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileToDrive(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileToDrive(e.target.files[0]);
    }
  };

  const uploadFileToDrive = async (file: File) => {
    if (!token) return;
    setUploading(true);
    setUploadMessage(null);
    try {
      // Define metadata
      const metadata = {
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
      };

      // Create boundary block for multipart body
      const boundary = 'vessel_nexus_boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelim = `\r\n--${boundary}--`;

      // Read file content as base64 or text
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result;
        if (!fileContent) {
          setUploadMessage({ type: 'error', text: 'Error reading file content' });
          setUploading(false);
          return;
        }

        // We use binary construction
        const arrayBuffer = fileContent as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let binaryString = '';
        const chunkSize = 8192; // Process in chunks to prevent calling String.fromCharCode with too many arguments
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, Array.from(chunk));
        }
        const base64Data = btoa(binaryString);

        // Standard multipart request
        const multipartBody = 
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + (file.type || 'application/octet-stream') + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n\r\n' +
          base64Data +
          closeDelim;

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartBody
        });

        if (!response.ok) {
          throw new Error('Upload error. File size could exceed available capacity or permissions are missing.');
        }

        setUploadMessage({ type: 'success', text: `Successfully compiled and pushed: ${file.name}` });
        fetchFiles(token);
        setUploading(false);
      };

      reader.onerror = () => {
        throw new Error('File reading failed');
      };
      
      reader.readAsArrayBuffer(file);

    } catch (err: any) {
      setUploadMessage({ type: 'error', text: err.message || 'Could not upload file' });
      setUploading(false);
    }
  };

  // Filter & Search files
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (fileTypeFilter === 'all') return matchesSearch;
    if (fileTypeFilter === 'folder') return matchesSearch && f.mimeType === 'application/vnd.google-apps.folder';
    if (fileTypeFilter === 'document') return matchesSearch && !f.mimeType.includes('folder') && !f.mimeType.startsWith('image/') && !f.mimeType.startsWith('video/');
    if (fileTypeFilter === 'image') return matchesSearch && f.mimeType.startsWith('image/');
    if (fileTypeFilter === 'video') return matchesSearch && f.mimeType.startsWith('video/');
    
    return matchesSearch;
  });

  // Get matching UI file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="size-6 text-emerald-400 fill-emerald-500/10 shrink-0" />;
    }
    if (mimeType.includes('document') || mimeType.includes('text') || mimeType.includes('pdf')) {
      return <FileText className="size-6 text-cyan-400 shrink-0" />;
    }
    if (mimeType.startsWith('image/')) {
      return <FileImage className="size-6 text-violet-400 shrink-0" />;
    }
    if (mimeType.startsWith('video/')) {
      return <Video className="size-6 text-purple-400 shrink-0" />;
    }
    return <File className="size-6 text-zinc-400 shrink-0" />;
  };

  const getFriendlySize = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '—';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (authChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-zinc-800 bg-zinc-950/40 rounded-2xl p-8 backdrop-blur-sm">
        <Loader2 className="size-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-zinc-500 font-mono text-sm">SYNCHRONIZING WITH SECURITY CONTEXT...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900/60 to-emerald-950/20 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Folder className="size-48 text-emerald-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              INTEGRATION PROTOCOL: DRIVE
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Google Drive Explorer</h2>
            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              Compile, archive, and view vessel telemetry data directly in Google Drive. Real-time file sync with secure, user-permitted authentication.
            </p>
          </div>

          <div>
            {!token ? (
              <button 
                onClick={handleSignIn}
                disabled={loading}
                className="gsi-material-button hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                id="drive-gsi-btn"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-semibold font-mono text-xs">Sign in with Google</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-zinc-950/60 border border-zinc-800 p-2.5 rounded-xl">
                {user?.photoURL && (
                  <img src={user.photoURL} alt="Avatar" className="size-8 rounded-full border border-emerald-500/20" />
                )}
                <div className="text-left font-mono">
                  <span className="block text-xs font-bold text-white max-w-[120px] truncate">{user?.displayName || 'Active Agent'}</span>
                  <span className="block text-[10px] text-emerald-400">STATUS: RE-CONNECTED</span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
                  <button 
                    onClick={() => fetchFiles(token)}
                    disabled={loading}
                    className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                    title="Synchronize Files"
                    id="drive-refresh-btn"
                  >
                    <RefreshCw className={`size-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition"
                    title="Disconnect Node"
                    id="drive-logout-btn"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {errMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-xs font-mono items-start">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">EXCURSION EVENT DETECTED:</span>
            <p className="text-zinc-300 font-sans">{errMessage}</p>
          </div>
          <button onClick={() => setErrMessage(null)} className="ml-auto text-red-400/50 hover:text-red-400 transition">
            <X className="size-4" />
          </button>
        </div>
      )}

      {token ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main workspace (3rd/4th width grid) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search/Filter Controls Bar */}
            <div className="flex flex-col md:flex-row gap-3 bg-zinc-900/40 border border-zinc-800/80 p-3 rounded-xl backdrop-blur-sm justify-between">
              
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Query archive files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 transition"
                />
              </div>

              <div className="flex items-center gap-2">
                
                {/* File Type Filter Tabs */}
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-[10px] font-mono select-none">
                  {['all', 'folder', 'document', 'image', 'video'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFileTypeFilter(type)}
                      className={`px-2.5 py-1.5 rounded-md uppercase font-semibold transition-all ${
                        fileTypeFilter === type 
                          ? 'bg-zinc-850 text-white' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Grid vs List View Toggles */}
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-zinc-500">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-emerald-400' : 'hover:text-zinc-300'}`}
                  >
                    <Grid className="size-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-emerald-400' : 'hover:text-zinc-300'}`}
                  >
                    <List className="size-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Folder creation box / trigger */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">
                LISTING: <span className="text-white">{filteredFiles.length}</span> archives synced
              </span>

              {isCreatingFolder ? (
                <form onSubmit={handleCreateFolder} className="flex gap-2 items-center bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg">
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-mono rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-emerald-500/40"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={creatingFolderLoading}
                    className="px-2 py-1 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded disabled:opacity-50"
                  >
                    {creatingFolderLoading ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreatingFolder(false); setNewFolderName(''); }}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="size-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 transition rounded-lg text-emerald-400"
                >
                  <FolderPlus className="size-3.5" />
                  <span>NEW_FOLDER</span>
                </button>
              )}
            </div>

            {/* Files View stage */}
            {loading && filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/20 border border-zinc-800 border-dashed rounded-2xl">
                <Loader2 className="size-6 text-emerald-400 animate-spin mb-3" />
                <p className="text-xs font-mono text-zinc-500 uppercase">Synchronizing storage database...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/20 border border-zinc-800 border-dashed rounded-2xl text-center px-4">
                <Folder className="size-10 text-zinc-700 mb-3" />
                <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase mb-1">No file vectors matched</h3>
                <p className="text-[11px] text-zinc-600 font-mono max-w-sm">No synchronized objects fall within your select filter rules or query parameters.</p>
              </div>
            ) : viewMode === 'grid' ? (
              
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`p-4 rounded-xl border transition-all text-left group cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden ${
                      selectedFile?.id === file.id 
                        ? 'border-emerald-500/40 bg-emerald-500/[0.02]' 
                        : 'border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40'
                    }`}
                  >
                    {/* Top row */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg">
                          {getFileIcon(file.mimeType)}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-150">
                          {file.webViewLink && (
                            <a 
                              href={file.webViewLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
                              title="Open Web link"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(file);
                            }}
                            className="p-1 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-400 transition"
                            title="Purge Object"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white font-mono leading-snug truncate" title={file.name}>
                        {file.name}
                      </h4>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-3 border-t border-zinc-800/40">
                      <span>{getFriendlySize(file.size)}</span>
                      <span>{new Date(file.modifiedTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              
              /* LIST VIEW */
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/10">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-500 text-[10px] tracking-wider font-semibold uppercase">
                      <th className="py-3 px-4">OBJECT NAME</th>
                      <th className="py-3 px-4">MIME TYPE</th>
                      <th className="py-3 px-4">SIZE</th>
                      <th className="py-3 px-4">MODIFIED DATE</th>
                      <th className="py-3 px-4 text-right">VECTOR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredFiles.map((file) => (
                      <tr 
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`hover:bg-zinc-900/40 cursor-pointer transition ${
                          selectedFile?.id === file.id ? 'bg-emerald-500/[0.02]' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-3 max-w-[240px] md:max-w-xs truncate">
                          {getFileIcon(file.mimeType)}
                          <span title={file.name}>{file.name}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-500 truncate max-w-[150px]" title={file.mimeType}>
                          {file.mimeType.replace('application/vnd.google-apps.', '').replace('application/', '')}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">{getFriendlySize(file.size)}</td>
                        <td className="py-3 px-4 text-zinc-500">{new Date(file.modifiedTime).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {file.webViewLink && (
                              <a 
                                href={file.webViewLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
                                title="Open in Drive"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            )}
                            <button 
                              onClick={() => setDeleteTarget(file)}
                              className="p-1 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-400 transition"
                              title="Delete File"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Side panel: File details & Live Drop Uplink Upload */}
          <div className="space-y-6">
            
            {/* Direct Drag & Drop Active Upload zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition select-none ${
                dragActive 
                  ? 'border-emerald-400 bg-emerald-500/[0.04]' 
                  : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/80 hover:bg-zinc-900/40'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleFileSelect}
              />
              
              {uploading ? (
                <div className="space-y-3">
                  <Loader2 className="size-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs font-mono text-zinc-400">TRANSFERRING STREAM VECTOR...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="size-8 text-zinc-500 group-hover:text-emerald-400 mx-auto transition" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 font-mono">DRAG & DROP ARTIFACT</h4>
                    <p className="text-[10px] text-zinc-650 font-sans mt-1">Accepts telemetry nodes, media or text. Tap to select local file.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Message Info */}
            {uploadMessage && (
              <div className={`p-3.5 rounded-xl border font-mono text-[11px] flex gap-2 items-start ${
                uploadMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {uploadMessage.type === 'success' ? (
                  <CheckCircle className="size-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <span className="font-bold">{uploadMessage.type === 'success' ? 'ARCHIVED:' : 'TRANSFER ERROR:'}</span>
                  <p className="text-zinc-300 font-sans leading-relaxed">{uploadMessage.text}</p>
                </div>
              </div>
            )}

            {/* Direct Inspection details side card */}
            {selectedFile ? (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="size-3.5 text-emerald-400" />
                    INSPECTED_NODE
                  </h3>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-zinc-850 rounded text-zinc-500 hover:text-zinc-300 transition"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="block text-[10px] text-zinc-550 uppercase">Name</span>
                    <p className="text-zinc-200 mt-1 font-bold break-all">{selectedFile.name}</p>
                  </div>

                  <div>
                    <span className="block text-[10px] text-zinc-550 uppercase">Mime Type</span>
                    <p className="text-zinc-400 mt-1 text-xs">{selectedFile.mimeType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <div>
                      <span className="block text-[10px] text-zinc-550 uppercase">Capacity</span>
                      <p className="text-zinc-300 mt-1 font-semibold">{getFriendlySize(selectedFile.size)}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-550 uppercase">Last Sync</span>
                      <p className="text-zinc-300 mt-1">{new Date(selectedFile.modifiedTime).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedFile.webViewLink && (
                    <a 
                      href={selectedFile.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98] transition font-bold"
                    >
                      <ExternalLink className="size-4" />
                      <span>OPEN_IN_DRIVE</span>
                    </a>
                  )}

                  <button 
                    onClick={() => setDeleteTarget(selectedFile)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500/20 active:scale-[0.98] transition font-bold"
                  >
                    <Trash2 className="size-4" />
                    <span>PURGE_ARCHIVE</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-zinc-800/80 bg-zinc-900/10 rounded-xl p-5 text-center text-zinc-500 font-mono text-[11px] py-10">
                <Info className="size-5 text-zinc-705 mx-auto mb-2" />
                <p>Select a file vector from the registry matrix to inspect its metadata footprint.</p>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] border border-zinc-850 bg-zinc-950/20 rounded-2xl p-8 backdrop-blur-sm text-center">
          <Folder className="size-12 text-zinc-700 mb-4" />
          <h3 className="text-sm font-bold text-white font-mono uppercase mb-2">Workspace Ingress Blocked</h3>
          <p className="text-xs text-zinc-500 font-mono max-w-md leading-relaxed mb-6">
            A secure OAuth session must be connected with permission to browse, compose or delete archives from Google Drive.
          </p>
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-[0.97] transition font-bold font-mono text-xs rounded-xl flex items-center gap-2 disabled:opacity-50"
            id="drive-connect-btn"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin text-zinc-950" />
            ) : (
              <Plus className="size-4 text-zinc-950" />
            )}
            <span>CONNECT GOOGLE DRIVE PROTOCOL</span>
          </button>
        </div>
      )}

      {/* CUSTOM BEAUTIFUL PURGE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start gap-3 text-red-400 font-mono">
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">AETHERIUM STORAGE DISPOSAL</h3>
                <span className="text-[10px] text-zinc-500">ACTION_RECONCILIATION: DESTRUCTIVE</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Are you sure you want to permanently dispose from the Aetherium workspace the following file node? This action directly purges user-owned Google Drive storage data and cannot be undone:
            </p>

            <div className="p-3 bg-black/40 border border-zinc-800 rounded-lg flex items-center gap-3 font-mono text-xs text-zinc-200">
              {getFileIcon(deleteTarget.mimeType)}
              <div className="min-w-0 flex-1">
                <span className="block font-bold truncate">{deleteTarget.name}</span>
                <span className="block text-[10px] text-zinc-500 truncate">{deleteTarget.mimeType}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-4 py-2 font-mono text-xs font-bold border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:bg-zinc-800 rounded-xl transition"
              >
                ABORT_DISPOSAL
              </button>
              <button
                type="button"
                onClick={() => handleDeleteFile(deleteTarget)}
                disabled={deleteLoading}
                className="px-4 py-2 font-mono text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition flex items-center gap-2 shadow-[0_4px_12px_rgba(239,68,68,0.2)] disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                <span>CONFIRM_PURGE_DESTRUCTIVE</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
