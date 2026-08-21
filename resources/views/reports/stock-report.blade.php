<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        @page { margin: 54px 28px 42px; }
        * { box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; color: #172033; font-size: 9px; margin: 0; }
        .header { border-bottom: 3px solid {{ $isBranch ? '#2563eb' : '#059669' }}; padding-bottom: 10px; margin-bottom: 14px; }
        h1 { font-size: 20px; margin: 0 0 6px; color: {{ $isBranch ? '#1d4ed8' : '#047857' }}; }
        .meta { color: #475569; font-size: 10px; }
        .badge { display: inline-block; margin-left: 12px; padding: 3px 8px; border-radius: 10px; background: #eef2ff; color: #3730a3; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        th { padding: 7px 5px; color: #fff; background: {{ $isBranch ? '#2563eb' : '#059669' }}; text-align: center; font-size: 8px; }
        td { padding: 6px 5px; border: 1px solid #dbe3ed; vertical-align: top; overflow-wrap: break-word; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        td.number { text-align: right; }
        td.center { text-align: center; }
        tfoot td { font-weight: bold; background: {{ $isBranch ? '#dbeafe' : '#d1fae5' }}; }
        .empty { text-align: center; color: #64748b; padding: 24px; }
        .footer { position: fixed; left: 0; right: 0; bottom: -27px; border-top: 1px solid #cbd5e1; padding-top: 6px; color: #64748b; font-size: 8px; }
        .page-number:after { content: counter(page); }
        .right { float: right; }
        .w-no { width: 4%; } .w-date { width: 8%; } .w-ref { width: 11%; } .w-branch { width: 12%; }
        .w-category { width: 12%; } .w-product { width: {{ $isBranch ? '20%' : '34%' }}; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="meta">Periode: {{ $period }} @if($branchName)<span class="badge">Cabang: {{ $branchName }}</span>@endif</div>
    </div>

    <table>
        <thead>
            <tr>
                <th class="w-no">No</th>
                @if($isBranch)
                    <th class="w-date">Tanggal</th><th class="w-ref">No. Permintaan</th><th class="w-branch">Cabang</th>
                @endif
                <th class="w-category">Kategori</th><th class="w-product">Barang</th>
                @foreach($stockColumns as $column)<th>{{ $column['label'] }}</th>@endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $index => $row)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    @if($isBranch)
                        <td class="center">{{ \Carbon\Carbon::parse($row['date'])->format('d-m-Y') }}</td>
                        <td>{{ $row['reference'] }}</td><td>{{ $row['branch'] }}</td>
                    @endif
                    <td>{{ $row['category'] }}</td><td>{{ $row['product'] }}</td>
                    @foreach($stockColumns as $column)<td class="number">{{ number_format($row[$column['key']], 0, ',', '.') }}</td>@endforeach
                </tr>
            @empty
                <tr><td class="empty" colspan="{{ 3 + count($stockColumns) + ($isBranch ? 3 : 0) }}">Tidak ada data pada periode ini.</td></tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <td colspan="{{ $isBranch ? 6 : 3 }}" class="number">TOTAL</td>
                @foreach($stockColumns as $column)<td class="number">{{ number_format($totals[$column['key']], 0, ',', '.') }}</td>@endforeach
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Dicetak pada {{ now()->timezone('Asia/Makassar')->format('d-m-Y H:i') }} WITA
        <span class="right">Halaman <span class="page-number"></span></span>
    </div>
</body>
</html>
