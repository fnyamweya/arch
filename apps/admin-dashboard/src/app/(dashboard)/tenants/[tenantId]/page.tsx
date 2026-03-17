interface TenantPageProps {
  readonly params: {
    readonly tenantId: string;
  };
}

export default function TenantDetailPage(props: TenantPageProps): JSX.Element {
  return <main>Tenant {props.params.tenantId}</main>;
}
