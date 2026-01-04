import plugin from '../plugin.json';

class FlutterPlugin {
    async init($page, cache, baseUrl) {
        this.$page = $page;
        this.baseUrl = baseUrl;

        // 1. Register Dart IntelliSense
        this.setupIntellisense();

        // 2. Add a command to open the Flutter Previewer
        acode.addCommand({
            name: 'flutter_preview',
            description: 'Run Flutter Preview',
            bindKey: { win: 'Ctrl-Shift-P', mac: 'Command-Shift-P' },
            exec: () => this.openPreviewer(),
        });

        window.toast('Flutter & Dart Plugin Initialized!', 3000);
    }

    setupIntellisense() {
        const { editor } = editorManager;
        const languageTools = ace.require("ace/ext/language_tools");

        const dartCompleter = {
            getCompletions: (editor, session, pos, prefix, callback) => {
                // Here you would normally fetch data from a LSP or a local dictionary
                // Example of static snippets for Flutter:
                const snippets = [
                    { caption: 'stless', snippet: 'class ${1:MyWidget} extends StatelessWidget {\n\t@override\n\tWidget build(BuildContext context) {\n\t\treturn ${2:Container()};\n\t}\n}', meta: 'Flutter' },
                    { caption: 'stful', snippet: 'class ${1:MyWidget} extends StatefulWidget {\n\t@override\n\t_${1}State createState() => _${1}State();\n}\n\nclass _${1}State extends State<${1}> {\n\t@override\n\tWidget build(BuildContext context) {\n\t\treturn ${2:Container()};\n\t}\n}', meta: 'Flutter' }
                ];
                callback(null, snippets);
            }
        };

        languageTools.addCompleter(dartCompleter);
    }

    openPreviewer() {
        const activeFile = editorManager.activeFile;
        if (!activeFile || !activeFile.name.endsWith('.dart')) {
            window.alert('Open a Dart file first!');
            return;
        }

        // Logic to render code via a service like DartPad or a local server
        const code = activeFile.session.getValue();
        
        // Example: Opening a side sheet with an IFrame
        this.$page.header.title = 'Flutter Preview';
        this.$page.innerHTML = `
            <div style="width:100%; height:100%; background:#fff;">
                <iframe id="flutter-frame" src="https://dartpad.dev/embed-flutter.html" 
                    style="width:100%; height:100%; border:none;">
                </iframe>
            </div>
        `;
        this.$page.show();
        
        // Note: You would typically post the 'code' to the DartPad iframe 
        // using window.postMessage once the frame loads.
    }

    async destroy() {
        // Cleanup commands or listeners here
    }
}

acode.setPluginInit(plugin.id, (baseUrl, $page, cache) => {
    const flutterPlugin = new FlutterPlugin();
    flutterPlugin.init($page, cache, baseUrl);
    acode.setPluginUnmount(plugin.id, () => flutterPlugin.destroy());
});
