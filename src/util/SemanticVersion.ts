export class SemanticVersion {
    versionString: string;

    constructor(semanticVersionString: string) {
        this.versionString = semanticVersionString;
    }

    getMajor() {
        return this.decomposeVersionString(this.versionString).major;
    }

    decomposeVersionString(
        versionString: string
    ): { major: number; minor: number; patch: number } {
        const splittedVersion = versionString.split('.').map(version => {
            const numberValue = Number(version);
            if (isNaN(numberValue)) {
                throw new Error(
                    `The semantic version string is invalid, input: ${versionString}`
                );
            }
            return numberValue;
        });
        return {
            major: splittedVersion[0],
            minor: splittedVersion[1],
            patch: splittedVersion[2],
        };
    }
}
