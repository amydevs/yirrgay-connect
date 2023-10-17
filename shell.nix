{ pkgs ? import ./pkgs.nix {}, ci ? false }:

with pkgs;
mkShell {
  buildInputs = [
    gitAndTools.gh
    # Deps
    nodejs
  ];
  # Don't set rpath for native addons
  NIX_DONT_SET_RPATH = true;
  NIX_NO_SELF_RPATH = true;
  shellHook = ''
    export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
    export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
    export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
    export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"

    echo "Entering $(npm pkg get name)"
    
    set -o allexport
    . ./.env
    set +o allexport
    set -v
    ${
      lib.optionalString ci
      ''
      set -o errexit
      set -o nounset
      set -o pipefail
      shopt -s inherit_errexit
      ''
    }
    mkdir --parents "$(pwd)/tmp"

    # Built executables and NPM executables
    export PATH="$(pwd)/dist/bin:$(npm root)/.bin:$PATH"

    # Path to headers used by node-gyp for native addons
    export npm_config_nodedir="${nodejs}"

    # Verbose logging of the Nix compiler wrappers
    export NIX_DEBUG=1

    npm install --ignore-scripts

    set +v
  '';
}
