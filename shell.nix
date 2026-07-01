{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    (python313.withPackages (ps: with ps; [
      mkdocs
      mkdocs-material
      mkdocs-minify-plugin
    ]))
  ];
}
