<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Jalan {{ $deliveryNoteNumber }}</title>
    <style>
        @page { margin: 54px 68px 45px; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #111; font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        .document-title { margin: 0; text-align: center; font-size: 20px; font-weight: 700; line-height: 1.25; }
        .document-subtitle { margin: 0 0 8px; text-align: center; font-size: 18px; font-weight: 700; line-height: 1.2; }
        .metadata { width: 100%; margin: 0 0 22px; border-collapse: collapse; }
        .metadata td { padding: 2px 4px; vertical-align: top; }
        .metadata .label { width: 84px; font-weight: 700; white-space: nowrap; }
        .metadata .colon { width: 10px; font-weight: 700; }
        .metadata .left-value { width: 270px; font-weight: 700; }
        .metadata .right-label { width: 74px; font-weight: 700; white-space: nowrap; }
        .items { width: 100%; border-collapse: collapse; }
        .items th, .items td { border: 1px solid #111; }
        .items th { padding: 5px 4px; text-align: center; font-size: 11px; font-weight: 700; }
        .items td { padding: 6px 5px; vertical-align: top; }
        .items .number, .items .quantity, .items .unit, .items .notes { text-align: center; }
        .items .filler td { height: {{ max(245 - ($items->count() * 27), 35) }}px; border-top: 0; }
        .signatures { width: 100%; margin-top: 42px; border-collapse: collapse; page-break-inside: avoid; }
        .signatures td { width: 50%; padding: 0 48px; text-align: center; font-weight: 700; }
        .signatures .space { height: 78px; }
        .name-line { display: inline-block; min-width: 145px; border-bottom: 1px solid #111; font-weight: 400; }
        .receiver-line { display: inline-block; min-width: 145px; border-bottom: 1px solid #111; }
    </style>
</head>
<body>
    <h1 class="document-title">RSM-RDP</h1>
    <h2 class="document-subtitle">SURAT JALAN</h2>

    <table class="metadata">
        <tr>
            <td class="label">TUJUAN</td><td class="colon">:</td>
            <td class="left-value">{{ strtoupper($requestOrder->branch->branch_name) }}</td>
            <td class="right-label">NO. SJ</td><td class="colon">:</td><td>{{ $deliveryNoteNumber }}</td>
        </tr>
        <tr>
            <td class="label">ALAMAT</td><td class="colon">:</td>
            <td class="left-value">{{ $requestOrder->branch->branch_address }}</td>
            <td class="right-label">TANGGAL</td><td class="colon">:</td><td>{{ $shippingDate }}</td>
        </tr>
        <tr>
            <td class="label">NO. R.O</td><td class="colon">:</td>
            <td class="left-value">{{ $requestOrder->ro_number }}</td><td colspan="3"></td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th class="number" width="5%">NO.</th><th class="description" width="55%">URAIAN</th>
                <th class="quantity" width="10%">JUMLAH</th><th class="unit" width="12%">SATUAN</th><th class="notes" width="18%">KET</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="number">{{ $index + 1 }}</td><td>{{ $item['description'] }}</td>
                    <td class="quantity">{{ number_format($item['quantity'], 0, ',', '.') }}</td>
                    <td class="unit">{{ $item['unit'] }}</td><td class="notes">{{ $item['notes'] }}</td>
                </tr>
            @endforeach
            <tr class="filler"><td></td><td></td><td></td><td></td><td></td></tr>
        </tbody>
    </table>

    <table class="signatures">
        <tr><td>PENGIRIM/LOGISTIK</td><td>PENERIMA</td></tr>
        <tr><td class="space"></td><td class="space"></td></tr>
        <tr>
            <td>NAMA: <span class="name-line">{{ $senderName ?: '' }}</span></td>
            <td>NAMA: <span class="receiver-line">&nbsp;</span></td>
        </tr>
    </table>
</body>
</html>
