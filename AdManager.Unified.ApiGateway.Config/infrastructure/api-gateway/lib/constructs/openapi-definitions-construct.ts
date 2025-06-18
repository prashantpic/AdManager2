import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml'; // Ensure 'js-yaml' and '@types/js-yaml' are in package.json

export interface OpenApiDefinitionsConstructProps {
    /**
     * Optional: base path to OpenAPI files if not default.
     * Default is '../openapi' relative to this construct file.
     */
    readonly openApiDir?: string;
}

export class OpenApiDefinitionsConstruct extends Construct {
  private readonly baseDir: string;

  constructor(scope: Construct, id: string, props?: OpenApiDefinitionsConstructProps) {
    super(scope, id);
    this.baseDir = props?.openApiDir || path.join(__dirname, '../../../openapi');
  }

  /**
   * Loads an OpenAPI definition from a local YAML file and returns it as an InlineApiDefinition.
   * This method is suitable for `RestApi` where the definition is embedded.
   * For complex `$ref` handling across multiple files that CDK's inline processing
   * might not fully resolve, consider pre-bundling OpenAPI specs or using `SpecRestApi` with S3 assets.
   * @param fileName The name of the YAML file in the openApiDir.
   * @returns apigateway.InlineApiDefinition
   */
  private loadApiDefinitionFromFile(fileName: string): apigateway.InlineApiDefinition {
    const filePath = path.join(this.baseDir, fileName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`OpenAPI file not found: ${filePath}`);
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const definitionObject = yaml.load(fileContent);
    return apigateway.ApiDefinition.fromInline(definitionObject);
  }

  /**
   * Loads an OpenAPI definition from a local YAML file and uploads it as an S3 asset.
   * This method is suitable for `SpecRestApi` where the API definition is sourced from S3.
   * This allows for more complex OpenAPI structures with inter-file $refs that API Gateway can resolve from S3.
   * @param fileName The name of the YAML file in the openApiDir.
   * @param assetId A unique ID for the S3 asset within the CDK construct.
   * @returns apigateway.AssetApiDefinition
   */
  private loadApiDefinitionAsAsset(fileName: string, assetId: string): apigateway.AssetApiDefinition {
    const filePath = path.join(this.baseDir, fileName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`OpenAPI file not found: ${filePath}`);
    }
    const asset = new s3assets.Asset(this, assetId, {
      path: filePath,
    });
    return apigateway.ApiDefinition.fromS3Bucket(asset.bucket, asset.s3ObjectKey);
  }

  /**
   * Gets the Merchant API definition.
   * Consider using `getMerchantApiDefinitionAsAsset` if you intend to use it with `SpecRestApi`.
   */
  public getMerchantApiDefinition(): apigateway.InlineApiDefinition {
    return this.loadApiDefinitionFromFile('merchant-api.yaml');
  }

  public getMerchantApiDefinitionAsAsset(): apigateway.AssetApiDefinition {
    return this.loadApiDefinitionAsAsset('merchant-api.yaml', 'MerchantApiSpecAsset');
  }

  /**
   * Gets the Admin API definition.
   */
  public getAdminApiDefinition(): apigateway.InlineApiDefinition {
    return this.loadApiDefinitionFromFile('admin-api.yaml');
  }

  public getAdminApiDefinitionAsAsset(): apigateway.AssetApiDefinition {
    return this.loadApiDefinitionAsAsset('admin-api.yaml', 'AdminApiSpecAsset');
  }

  /**
   * Gets the Affiliate API definition.
   */
  public getAffiliateApiDefinition(): apigateway.InlineApiDefinition {
    return this.loadApiDefinitionFromFile('affiliate-api.yaml');
  }

  public getAffiliateApiDefinitionAsAsset(): apigateway.AssetApiDefinition {
    return this.loadApiDefinitionAsAsset('affiliate-api.yaml', 'AffiliateApiSpecAsset');
  }


  /**
   * Gets the Third-Party App API definition.
   */
  public getThirdPartyAppApiDefinition(): apigateway.InlineApiDefinition {
    return this.loadApiDefinitionFromFile('third-party-app-api.yaml');
  }

  public getThirdPartyAppApiDefinitionAsAsset(): apigateway.AssetApiDefinition {
    return this.loadApiDefinitionAsAsset('third-party-app-api.yaml', 'ThirdPartyAppApiSpecAsset');
  }

  /**
   * Gets the Shared Components definition. While usually referenced via `$ref` by other specs,
   * this could be useful if it needs to be loaded independently for some reason.
   */
  public getSharedComponentsDefinition(): apigateway.InlineApiDefinition {
    return this.loadApiDefinitionFromFile('shared-components.yaml');
  }


  /**
   * Provides a root OpenAPI specification suitable for `apigateway.SpecRestApi`.
   * This typically involves a single root OpenAPI file that `$refs` other specification files.
   * The root file and all referenced files must be structured in a way that API Gateway
   * can resolve them when loaded from S3 (e.g., relative paths within the S3 asset structure).
   * For this to work correctly, you might need to pre-bundle your OpenAPI files into a single
   * file or a correctly structured set of files before creating the S3 asset.
   *
   * @param rootFileName The name of the root OpenAPI YAML file (e.g., 'unified-api-root.yaml').
   * This file should be present in your `openApiDir`.
   * @returns apigateway.AssetApiDefinition
   */
  public getRootApiSpecForSpecRestApi(rootFileName: string): apigateway.AssetApiDefinition {
    // Note: If rootFileName itself is not sufficient and needs its $refs to be resolved
    // from other files within the same S3 asset, ensure the S3 asset is created from a directory
    // containing all necessary files with correct relative $ref paths.
    // For simplicity here, we assume rootFileName is either self-contained or API Gateway/S3 handles refs.
    // A more robust solution might involve an OpenAPI bundling tool as a pre-CDK step.
    console.warn(
        `Ensure that '${rootFileName}' and its $refs are correctly structured for S3 deployment ` +
        `if using apigateway.SpecRestApi. Consider OpenAPI bundling tools for complex cases.`
    );
    return this.loadApiDefinitionAsAsset(rootFileName, `${rootFileName.replace('.yaml', '').replace('.yml', '')}RootAsset`);
  }
}