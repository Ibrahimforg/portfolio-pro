'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Grid3x3,
  FileImage,
  Save,
  Eye,
  Edit3,
  History,
  Search,
  Filter,
  Upload,
  Trash2,
  Copy,
  Download,
  Share2,
  Lock,
  Unlock,
  Clock,
  User,
  Tag,
  Folder,
  Star,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Initialisation lowlight pour la coloration syntaxique
const lowlight = createLowlight()

interface MediaFile {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: string
  tags: string[]
  folder?: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
  }
}

interface ContentVersion {
  id: string
  content: string
  author: string
  timestamp: string
  changes: string
  isCurrent: boolean
}

interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
  metaRobots: string
  structuredData?: string
}

export default function AdvancedEditor() {
  const [activeTab, setActiveTab] = useState<'editor' | 'media' | 'seo' | 'versions'>('editor')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: [],
    metaRobots: 'index,follow'
  })
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [uploadProgress, setUploadProgress] = useState(0)

  // Configuration de l'éditeur Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto',
        },
      }),
    ],
    content: '<p>Commencez à écrire votre contenu...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  // Simulation des données médias
  useEffect(() => {
    const mockMedia: MediaFile[] = [
      {
        id: '1',
        name: 'hero-banner.jpg',
        url: '/api/placeholder/800/400',
        type: 'image',
        size: 245760,
        uploadedAt: '2024-03-08T10:30:00Z',
        tags: ['banner', 'hero', 'homepage'],
        metadata: { width: 1920, height: 1080 }
      },
      {
        id: '2',
        name: 'portfolio-showcase.png',
        url: '/api/placeholder/600/400',
        type: 'image',
        size: 184320,
        uploadedAt: '2024-03-07T15:45:00Z',
        tags: ['portfolio', 'showcase'],
        metadata: { width: 1200, height: 800 }
      }
    ]
    setMediaFiles(mockMedia)

    const mockVersions: ContentVersion[] = [
      {
        id: '1',
        content: '<p>Version initiale du contenu</p>',
        author: 'John Doe',
        timestamp: '2024-03-08T09:00:00Z',
        changes: 'Création initiale',
        isCurrent: false
      },
      {
        id: '2',
        content: '<p>Version mise à jour avec nouvelles sections</p>',
        author: 'Jane Smith',
        timestamp: '2024-03-08T10:30:00Z',
        changes: 'Ajout sections et images',
        isCurrent: true
      }
    ]
    setVersions(mockVersions)
  }, [])

  const handleImageUpload = useCallback(async (file: File) => {
    setUploadProgress(0)
    
    // Simulation d'upload avec progression
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulation d'upload terminé
    setTimeout(() => {
      const newMedia: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        tags: [],
        metadata: file.type.startsWith('image/') ? {
          width: 800,
          height: 600
        } : undefined
      }
      setMediaFiles(prev => [newMedia, ...prev])
      setUploadProgress(0)
    }, 2000)
  }, [])

  const handleSave = useCallback(async () => {
    if (!editor) return
    
    setIsSaving(true)
    
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newVersion: ContentVersion = {
      id: Date.now().toString(),
      content: editor.getHTML(),
      author: 'Current User',
      timestamp: new Date().toISOString(),
      changes: 'Mise à jour du contenu',
      isCurrent: true
    }
    
    setVersions(prev => [
      ...prev.map(v => ({ ...v, isCurrent: false })),
      newVersion
    ])
    
    setIsSaving(false)
  }, [editor])

  const insertImage = useCallback((url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const restoreVersion = useCallback((version: ContentVersion) => {
    if (editor) {
      editor.commands.setContent(version.content)
    }
  }, [editor])

  const MenuButton = ({ 
    onClick, 
    icon: Icon, 
    isActive = false, 
    disabled = false,
    tooltip 
  }: {
    onClick: () => void
    icon: any
    isActive?: boolean
    disabled?: boolean
    tooltip?: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-2 rounded transition-colors",
        isActive ? "bg-primary text-white" : "hover:bg-surface-elevated text-text-secondary",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
    </button>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-text-primary mb-4">CMS Premium</h2>
          
          <nav className="space-y-2">
            {[
              { id: 'editor', label: 'Éditeur', icon: Edit3 },
              { id: 'media', label: 'Médiathèque', icon: FileImage },
              { id: 'seo', label: 'SEO', icon: TrendingUp },
              { id: 'versions', label: 'Versions', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Actions rapides */}
        <div className="border-t border-border p-4 space-y-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface"
          >
            <Eye className="w-4 h-4" />
            {isPreview ? 'Mode édition' : 'Aperçu'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            {!isPreview && (
              <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Text formatting */}
                  <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-lg">
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      icon={Bold}
                      isActive={editor?.isActive('bold')}
                      tooltip="Gras"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      icon={Italic}
                      isActive={editor?.isActive('italic')}
                      tooltip="Italique"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      icon={Underline}
                      tooltip="Souligné"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleStrike().run()}
                      icon={Strikethrough}
                      isActive={editor?.isActive('strike')}
                      tooltip="Barré"
                    />
                  </div>

                  {/* Headings */}
                  <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-lg">
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      icon={Heading1}
                      isActive={editor?.isActive('heading', { level: 1 })}
                      tooltip="Titre 1"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      icon={Heading2}
                      isActive={editor?.isActive('heading', { level: 2 })}
                      tooltip="Titre 2"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      icon={Heading3}
                      isActive={editor?.isActive('heading', { level: 3 })}
                      tooltip="Titre 3"
                    />
                  </div>

                  {/* Lists */}
                  <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-lg">
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      icon={List}
                      isActive={editor?.isActive('bulletList')}
                      tooltip="Liste à puces"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      icon={ListOrdered}
                      isActive={editor?.isActive('orderedList')}
                      tooltip="Liste numérotée"
                    />
                  </div>

                  {/* Other */}
                  <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-lg">
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                      icon={Code}
                      isActive={editor?.isActive('codeBlock')}
                      tooltip="Bloc de code"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      icon={Quote}
                      isActive={editor?.isActive('blockquote')}
                      tooltip="Citation"
                    />
                  </div>

                  {/* History */}
                  <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-lg">
                    <MenuButton
                      onClick={() => editor?.chain().focus().undo().run()}
                      icon={Undo}
                      disabled={!editor?.can().undo()}
                      tooltip="Annuler"
                    />
                    <MenuButton
                      onClick={() => editor?.chain().focus().redo().run()}
                      icon={Redo}
                      disabled={!editor?.can().redo()}
                      tooltip="Refaire"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Editor Content */}
            <div className="flex-1 overflow-auto p-6">
              {isPreview ? (
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
                  <EditorContent editor={editor} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Library Tab */}
        {activeTab === 'media' && (
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary">Médiathèque</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
                    />
                  </div>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-text-primary"
                  >
                    <option value="all">Tous les dossiers</option>
                    <option value="images">Images</option>
                    <option value="documents">Documents</option>
                    <option value="videos">Vidéos</option>
                  </select>
                  <label className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        files.forEach(handleImageUpload)
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="mb-6 p-4 bg-surface-elevated rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-primary">Upload en cours...</span>
                    <span className="text-sm text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Media Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaFiles.map((file) => (
                  <div key={file.id} className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-surface-elevated relative">
                      {file.type === 'image' ? (
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileImage className="w-12 h-12 text-text-tertiary" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => insertImage(file.url)}
                          className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button className="p-1 bg-black/50 text-white rounded hover:bg-black/70">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                      <p className="text-xs text-text-tertiary">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-xl font-semibold text-text-primary">Optimisation SEO</h3>
              
              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Titre (SEO)
                  </label>
                  <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
                    placeholder="Titre optimisé pour le SEO"
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    {seoData.title.length}/60 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={seoData.description}
                    onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
                    rows={3}
                    placeholder="Description optimisée pour le SEO"
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    {seoData.description.length}/160 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Mots-clés
                  </label>
                  <input
                    type="text"
                    value={seoData.keywords.join(', ')}
                    onChange={(e) => setSeoData(prev => ({ 
                      ...prev, 
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    }))}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
                    placeholder="mot1, mot2, mot3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    URL Canonique
                  </label>
                  <input
                    type="url"
                    value={seoData.canonicalUrl || ''}
                    onChange={(e) => setSeoData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
                    placeholder="https://example.com/page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Meta Robots
                  </label>
                  <select
                    value={seoData.metaRobots}
                    onChange={(e) => setSeoData(prev => ({ ...prev, metaRobots: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
                  >
                    <option value="index,follow">Index, Follow</option>
                    <option value="noindex,follow">No Index, Follow</option>
                    <option value="index,nofollow">Index, No Follow</option>
                    <option value="noindex,nofollow">No Index, No Follow</option>
                  </select>
                </div>
              </div>

              {/* SEO Score */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-text-primary mb-4">Score SEO</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">85/100</div>
                    <p className="text-sm text-text-secondary">Score Global</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">Bon</div>
                    <p className="text-sm text-text-secondary">Lisibilité</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">12</div>
                    <p className="text-sm text-text-secondary">Mots-clés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Versions Tab */}
        {activeTab === 'versions' && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Historique des versions</h3>
              
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version.id} className="bg-surface border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-4 h-4 text-text-tertiary" />
                          <span className="font-medium text-text-primary">{version.author}</span>
                          <Clock className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm text-text-secondary">
                            {new Date(version.timestamp).toLocaleString()}
                          </span>
                          {version.isCurrent && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                              Version actuelle
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{version.changes}</p>
                        <div className="bg-surface-elevated rounded-lg p-3 max-h-32 overflow-y-auto">
                          <div 
                            dangerouslySetInnerHTML={{ __html: version.content }}
                            className="prose prose-sm max-w-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!version.isCurrent && (
                          <button
                            onClick={() => restoreVersion(version)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                            title="Restaurer cette version"
                          >
                            <Undo className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setIsPreview(true)}
                          className="p-2 text-text-secondary hover:bg-surface-elevated rounded-lg"
                          title="Aperçu"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
