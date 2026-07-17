const DREI_COMPONENTS = new Set([
  'AccumulativeShadows',
  'AdaptiveDpr',
  'AdaptiveEvents',
  'ArcballControls',
  'AsciiRenderer',
  'BBAnchor',
  'Backdrop',
  'BakeShadows',
  'Billboard',
  'Bounds',
  'Box',
  'Bvh',
  'CameraControls',
  'CameraShake',
  'Capsule',
  'CatmullRomLine',
  'Caustics',
  'Center',
  'Circle',
  'Clone',
  'Cloud',
  'Clouds',
  'Cone',
  'ContactShadows',
  'CubeCamera',
  'CubeTexture',
  'CubicBezierLine',
  'CurveModifier',
  'CycleRaycast',
  'Cylinder',
  'Decal',
  'Detailed',
  'DeviceOrientationControls',
  'Dodecahedron',
  'DragControls',
  'Edges',
  'Effects',
  'Environment',
  'Example',
  'Extrude',
  'FaceControls',
  'FaceLandmarker',
  'Facemesh',
  'FacemeshEye',
  'Fbo',
  'Fbx',
  'FirstPersonControls',
  'Fisheye',
  'Float',
  'FlyControls',
  'GizmoHelper',
  'GizmoViewcube',
  'GizmoViewport',
  'Gltf',
  'GradientTexture',
  'Grid',
  'Helper',
  'Html',
  'Hud',
  'Icosahedron',
  'Image',
  'Instance',
  'InstancedAttribute',
  'Instances',
  'KeyboardControls',
  'Ktx2',
  'Lathe',
  'Lightformer',
  'Line',
  'Loader',
  'MapControls',
  'MarchingCube',
  'MarchingCubes',
  'MarchingPlane',
  'Mask',
  'Merged',
  'MeshDiscardMaterial',
  'MeshDistortMaterial',
  'MeshPortalMaterial',
  'MeshReflectorMaterial',
  'MeshRefractionMaterial',
  'MeshTransmissionMaterial',
  'MeshWobbleMaterial',
  'MotionPathControls',
  'MultiMaterial',
  'Octahedron',
  'OrbitControls',
  'OrthographicCamera',
  'Outlines',
  'PerformanceMonitor',
  'PerspectiveCamera',
  'PivotControls',
  'Plane',
  'Point',
  'PointMaterial',
  'PointerLockControls',
  'Points',
  'PointsBuffer',
  'Polyhedron',
  'PositionalAudio',
  'Preload',
  'PresentationControls',
  'QuadraticBezierLine',
  'RandomizedLight',
  'RenderCubeTexture',
  'RenderTexture',
  'Resize',
  'Ring',
  'RoundedBox',
  'RoundedBoxGeometry',
  'Sampler',
  'ScreenQuad',
  'ScreenSizer',
  'ScreenSpace',
  'ScreenVideoTexture',
  'Scroll',
  'ScrollControls',
  'Segment',
  'Segments',
  'Select',
  'Shadow',
  'ShadowAlpha',
  'Shape',
  'Sky',
  'SoftShadows',
  'Sparkles',
  'Sphere',
  'Splat',
  'SpotLight',
  'SpotLightShadow',
  'SpriteAnimator',
  'Stage',
  'Stars',
  'Stats',
  'StatsGl',
  'Svg',
  'Tetrahedron',
  'Text',
  'Text3D',
  'Texture',
  'Torus',
  'TorusKnot',
  'TrackballControls',
  'Trail',
  'TrailTexture',
  'TransformControls',
  'Tube',
  'VideoTexture',
  'View',
  'WebcamVideoTexture',
  'Wireframe',
])

const DREI_MODULE = '@react-three/drei'

function init({ typescript: ts }) {
  function create(info) {
    const languageService = info.languageService
    const proxy = Object.create(null)

    for (const key of Object.keys(languageService)) {
      proxy[key] = (...args) => languageService[key](...args)
    }

    proxy.getCompletionsAtPosition = (fileName, position, options, formattingSettings) => {
      const prior = languageService.getCompletionsAtPosition(fileName, position, options, formattingSettings)
      const sourceFile = getSourceFile(info, fileName)
      const text = sourceFile && sourceFile.getFullText()
      const context = text && getBareJsxComponentContext(text, position)

      if (!context) {
        return prior
      }

      const entries = prior ? [...prior.entries] : []
      const existingNames = new Set(entries.map((entry) => entry.name))

      for (const entry of entries) {
        if (!DREI_COMPONENTS.has(entry.name) || !entry.name.startsWith(context.prefix)) {
          continue
        }

        entry.insertText = `<${entry.name}$1 />`
        entry.isSnippet = true
        entry.replacementSpan = {
          start: context.start,
          length: context.end - context.start,
        }
        entry.hasAction = true
        entry.source = DREI_MODULE
        entry.sourceDisplay = [{ text: DREI_MODULE, kind: 'text' }]
        entry.labelDetails = {
          ...(entry.labelDetails || {}),
          description: DREI_MODULE,
        }
        entry.data = {
          ...(entry.data || {}),
          moduleSpecifier: DREI_MODULE,
          exportName: entry.name,
        }
      }

      for (const name of DREI_COMPONENTS) {
        if (!name.startsWith(context.prefix) || existingNames.has(name)) {
          continue
        }

        entries.push({
          name,
          kind: ts.ScriptElementKind.constElement,
          sortText: `0_drei_${name}`,
          insertText: `<${name}$1 />`,
          isSnippet: true,
          replacementSpan: {
            start: context.start,
            length: context.end - context.start,
          },
          hasAction: true,
          source: DREI_MODULE,
          sourceDisplay: [{ text: DREI_MODULE, kind: 'text' }],
          labelDetails: { description: DREI_MODULE },
          data: {
            moduleSpecifier: DREI_MODULE,
            exportName: name,
          },
        })
      }

      if (!entries.length) {
        return prior
      }

      return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: true,
        optionalReplacementSpan: prior && prior.optionalReplacementSpan,
        entries,
      }
    }

    proxy.getCompletionEntryDetails = (
      fileName,
      position,
      entryName,
      formatOptions,
      source,
      preferences,
      data,
    ) => {
      if (source !== DREI_MODULE || !DREI_COMPONENTS.has(entryName)) {
        return languageService.getCompletionEntryDetails(
          fileName,
          position,
          entryName,
          formatOptions,
          source,
          preferences,
          data,
        )
      }

      const prior = languageService.getCompletionEntryDetails(
        fileName,
        position,
        entryName,
        formatOptions,
        source,
        preferences,
        data,
      )

      const sourceFile = getSourceFile(info, fileName)
      const text = sourceFile && sourceFile.getFullText()
      const importChange = text && getDreiImportChange(fileName, text, entryName)
      const codeActions = importChange
        ? [
            {
              description: `Import '${entryName}' from '${DREI_MODULE}'`,
              changes: [importChange],
            },
          ]
        : []

      return {
        name: entryName,
        kind: ts.ScriptElementKind.constElement,
        kindModifiers: '',
        displayParts:
          prior && prior.displayParts && prior.displayParts.length
            ? prior.displayParts
            : [{ text: `const ${entryName}`, kind: 'text' }],
        documentation:
          prior && prior.documentation && prior.documentation.length
            ? prior.documentation
            : [{ text: `@react-three/drei component`, kind: 'text' }],
        tags: prior && prior.tags,
        codeActions,
        sourceDisplay: [{ text: DREI_MODULE, kind: 'text' }],
      }
    }

    return proxy
  }

  return { create }
}

function getSourceFile(info, fileName) {
  const program = info.languageService.getProgram()
  return program && program.getSourceFile(fileName)
}

function getBareJsxComponentContext(text, position) {
  const start = scanIdentifierStart(text, position)
  const end = scanIdentifierEnd(text, position)
  const prefix = text.slice(start, position)

  if (!prefix || !/^[A-Z][A-Za-z0-9]*$/.test(prefix)) {
    return undefined
  }

  if (isInsideTagNameOrAttribute(text, start)) {
    return undefined
  }

  if (!isProbablyInJsxText(text, start)) {
    return undefined
  }

  return { start, end, prefix }
}

function scanIdentifierStart(text, position) {
  let start = position
  while (start > 0 && /[A-Za-z0-9_$]/.test(text[start - 1])) {
    start -= 1
  }
  return start
}

function scanIdentifierEnd(text, position) {
  let end = position
  while (end < text.length && /[A-Za-z0-9_$]/.test(text[end])) {
    end += 1
  }
  return end
}

function isInsideTagNameOrAttribute(text, position) {
  const lastOpen = text.lastIndexOf('<', position)
  const lastClose = text.lastIndexOf('>', position)
  return lastOpen > lastClose
}

function isProbablyInJsxText(text, position) {
  const previousClose = text.lastIndexOf('>', position)
  const nextOpen = text.indexOf('<', position)
  return previousClose !== -1 && nextOpen !== -1 && previousClose < position && position < nextOpen
}

function getDreiImportChange(fileName, text, name) {
  const existingImport = findDreiNamedImport(text)

  if (existingImport) {
    if (existingImport.names.has(name)) {
      return undefined
    }

    return {
      fileName,
      textChanges: [
        {
          span: { start: existingImport.insertPosition, length: 0 },
          newText: existingImport.names.size ? `, ${name}` : name,
        },
      ],
    }
  }

  return {
    fileName,
    textChanges: [
      {
        span: { start: getImportInsertionPosition(text), length: 0 },
        newText: `import { ${name} } from '${DREI_MODULE}'\n`,
      },
    ],
  }
}

function findDreiNamedImport(text) {
  const importRegex = /import\s*\{([^}]*)\}\s*from\s*['"]@react-three\/drei['"];?/g
  const match = importRegex.exec(text)

  if (!match) {
    return undefined
  }

  const specifiers = match[1]
    .split(',')
    .map((part) => part.trim().split(/\s+as\s+/)[0])
    .filter(Boolean)

  return {
    names: new Set(specifiers),
    insertPosition: match.index + match[0].indexOf('}'),
  }
}

function getImportInsertionPosition(text) {
  const importRegex = /^import[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm
  let match
  let insertPosition = 0

  while ((match = importRegex.exec(text))) {
    insertPosition = match.index + match[0].length
    if (text[insertPosition] === '\r' && text[insertPosition + 1] === '\n') {
      insertPosition += 2
    } else if (text[insertPosition] === '\n') {
      insertPosition += 1
    }
  }

  return insertPosition
}

module.exports = init
