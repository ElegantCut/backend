import sys

file_path = r'C:\Elegant web\frontend\Elegant-Cut-vite\src\auth\LoginForm.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-white/90">Primer nombre </Label>
                  <Input placeholder="Primer Nombre " value={registerData.prim_nombre}
                    onChange={(e) => setRegisterData({ ...registerData, prim_nombre: e.target.value })}
                    required disabled={loading} className="h-12 bg-transparent border-neutral-800 focus-visible:ring-1 focus-visible:border-white text-white rounded-lg px-4" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-white/90">Segundo nombre </Label>
                  <Input placeholder="Segundo Nombre" value={registerData.apellido1}
                    onChange={(e) => setRegisterData({ ...registerData, apellido1: e.target.value })}
                    required disabled={loading} className="h-12 bg-transparent border-neutral-800 focus-visible:ring-1 focus-visible:border-white text-white rounded-lg px-4" />
                </div>
              </div>"""

replacement = """              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-white/90">Primer nombre</Label>
                  <Input placeholder="Primer nombre" value={registerData.prim_nombre}
                    onChange={(e) => setRegisterData({ ...registerData, prim_nombre: e.target.value })}
                    required disabled={loading} className="h-12 bg-transparent border-neutral-800 focus-visible:ring-1 focus-visible:border-white text-white rounded-lg px-4" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-white/90">Segundo nombre</Label>
                  <Input placeholder="Segundo nombre (opcional)" value={registerData.seg_nombre}
                    onChange={(e) => setRegisterData({ ...registerData, seg_nombre: e.target.value })}
                    disabled={loading} className="h-12 bg-transparent border-neutral-800 focus-visible:ring-1 focus-visible:border-white text-white rounded-lg px-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-white/90">Primer apellido</Label>
                  <Input placeholder="Primer apellido" value={registerData.apellido1}
                    onChange={(e) => setRegisterData({ ...registerData, apellido1: e.target.value })}
                    required disabled={loading} className="h-12 bg-transparent border-neutral-800 focus-visible:ring-1 focus-visible:border-white text-white rounded-lg px-4" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-white/90">Segundo apellido</Label>
                  <Input placeholder="Segundo apellido (opcional)" value={registerData.apellido2}
                    onChange={(e) => setRegisterData({ ...registerData, apellido2: e.target.value })}
                    disabled={loading} className="h-12 bg-transparent border-neutral-800 focus-visible:ring-1 focus-visible:border-white text-white rounded-lg px-4" />
                </div>
              </div>"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Replacement successful.')
else:
    print('Target not found. Please check the text.')
